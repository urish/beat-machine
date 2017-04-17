import { Injectable } from '@angular/core';
import { IMachine, IInstrument } from './machine-interfaces';

class PropertyWatcher<T> {
  private value: T;
  private watchers: Function[];

  constructor(obj: any, propertyName: string) {
    this.value = obj[propertyName];
    this.watchers = [];
    Object.defineProperty(obj, propertyName, {
      get: () => this.value,
      set: newValue => {
        this.value = newValue;
        this.watchers.forEach(watcher => watcher(newValue))
      }
    });
  }

  public register(fn: Function) {
    this.watchers.push(fn);
  }
}

class InstrumentPlayer {
  private gain: GainNode;
  private volume: number;
  private enabled: boolean;
  private gainMap: {
    [velocity: number]: GainNode
  };

  constructor(private context: AudioContext, private instrument: IInstrument, private engine: BeatEngineService) {
    this.reset();

    new PropertyWatcher(instrument, 'volume').register(newValue => {
      if (instrument.enabled) {
        this.gain.gain.value = newValue;
      }
    });

    new PropertyWatcher(instrument, 'enabled').register(enabled => {
      if (enabled) {
        this.reset();
        engine.rescheduleInstrument(this, this.instrument);
      } else {
        this.gain.gain.value = 0;
      }
    });

    new PropertyWatcher(instrument, 'activeProgram').register(activeProgram => {
      this.reset();
      engine.rescheduleInstrument(this, this.instrument);
    });
  }

  reset() {
    if (this.gain) {
      this.gain.disconnect();
    }
    this.gain = this.context.createGain();
    this.gain.connect(this.context.destination);
    this.gain.gain.value = this.instrument.enabled ? this.instrument.volume : 0;
    this.gainMap = {};
  }

  createNoteDestination(velocity: number): AudioNode {
    if (typeof velocity !== 'number' || velocity === 1.0) {
      return this.gain;
    }
    if (!this.gainMap[velocity]) {
      const newNode = this.context.createGain();
      newNode.connect(this.gain);
      newNode.gain.value = velocity;
      this.gainMap[velocity] = newNode;
    }
    return this.gainMap[velocity];
  }
}

class Mixer {
  public ready: boolean;
  private buffer: AudioBuffer;
  private bankDescriptor: any;
  private zeroTime: number = null;

  constructor(private context: AudioContext) {
    this.ready = false;
    this.loadBank('assets/audio/main.wav');
    this.loadBankDescriptor('assets/audio/main.json');
  }

  private loadBank(url: string) {
    const request = new XMLHttpRequest();
    request.open('GET', url, true);
    request.responseType = 'arraybuffer';
    request.onload = () => {
      this.context.decodeAudioData(request.response, buffer => {
        this.buffer = buffer;
        this.ready = true;
      });
    };
    request.send();
  }

  private loadBankDescriptor(url: string) {
    const request = new XMLHttpRequest();
    request.open('GET', url, true);
    request.onload = () => {
      this.bankDescriptor = JSON.parse(request.responseText);
    };
    request.send();
  }

  play(sampleName: string, player: InstrumentPlayer, when: number, velocity?: number) {
    const bufferSource = this.context.createBufferSource();
    bufferSource.connect(player.createNoteDestination(velocity));
    bufferSource.buffer = this.buffer;
    const sampleInfo = this.bankDescriptor[sampleName];
    if (this.zeroTime === null) {
      this.zeroTime = this.context.currentTime;
    }
    bufferSource.start(this.zeroTime + when, sampleInfo[1] / 44100.0, sampleInfo[2] / 44100.0);
  }

  reset() {
    this.zeroTime = null;
  }

  getCurrentTime(): number {
    return this.context.currentTime - this.zeroTime;
  }
}

export interface INoteSpec {
  beatOffset: number;
  sampleName: string;
  velocity?: number;
}

@Injectable()
export class BeatEngineService {
  private nextBeatIndex: number;

  private context: AudioContext;
  private mixer: Mixer;
  private interval: number;
  private beatTimer: number;
  private instrumentPlayers;
  private _machine: IMachine;

  constructor() {
    this.context = new AudioContext();
    this.mixer = new Mixer(this.context);
    this.nextBeatIndex = 0;
    this.instrumentPlayers = {};
  }

  get machine() {
    return this._machine;
  }

  set machine(value: IMachine) {
    if (value !== this._machine) {
      this._machine = value;
      if (this.machine) {
        new PropertyWatcher(this.machine, 'bpm')
          .register(newValue => {
            if (this.playing) {
              clearTimeout(this.interval);
              clearTimeout(this.beatTimer);
              this.stopAllInstruments();
              this.mixer.reset();
              this.nextBeatIndex = 0;
              this.scheduleBuffers();
            }
          });
      }
    }
  }

  public start() {
    this.scheduleBuffers();
  }

  private scheduleBuffers() {
    if (this.mixer.ready) {
      const beatTime = 60. / this.machine.bpm;
      while (this.nextBeatIndex - this.getBeatIndex() < 32) {
        const beatIndex = this.nextBeatIndex;
        this.machine.instruments.forEach(instrument => {
          let instrumentPlayer = this.instrumentPlayers[instrument.id];
          if (!instrumentPlayer) {
            instrumentPlayer = new InstrumentPlayer(this.context, instrument, this);
            this.instrumentPlayers[instrument.id] = instrumentPlayer;
          }
          this.instrumentNotes(instrument, beatIndex).forEach(note => {
            this.mixer.play(note.sampleName, instrumentPlayer, (beatIndex + note.beatOffset) * beatTime, note.velocity);
          });
        });
        this.nextBeatIndex++;
      }
    } else {
      console.log('Mixer not ready yet');
    }
    this.interval = setTimeout(() => this.scheduleBuffers(), 1000);
    this.beatTick();
  }

  rescheduleInstrument(player: InstrumentPlayer, instrument: IInstrument) {
    const beatTime = 60. / this.machine.bpm;
    for (let beatIndex = Math.ceil(this.getBeatIndex()); beatIndex < this.nextBeatIndex; beatIndex++) {
      this.instrumentNotes(instrument, beatIndex).forEach(note => {
        this.mixer.play(note.sampleName, player, (beatIndex + note.beatOffset) * beatTime, note.velocity);
      });
    }
  }

  private instrumentNotes(instrument: IInstrument, beatIndex: number): INoteSpec[] {
    if (instrument.enabled) {
      const program = instrument.programs[instrument.activeProgram];
      beatIndex = beatIndex % (program.length / 2);
      return program.notes
        .filter(note => (note.index === beatIndex * 2) || (note.index === beatIndex * 2 + 1))
        .map(note => {
          const pitch = instrument.pitchOffset + note.pitch;
          return {
            sampleName: instrument.id + '-' + pitch,
            beatOffset: note.index === beatIndex * 2 ? 0 : 0.5,
            velocity: note.velocity
          };
        });
    } else {
      return [];
    }
  }

  private stopAllInstruments() {
    Object.keys(this.instrumentPlayers).forEach(key => {
      this.instrumentPlayers[key].reset();
    });
  }

  public stop() {
    clearTimeout(this.interval);
    this.interval = null;
    clearTimeout(this.beatTimer);
    this.beatTimer = null;
    this.stopAllInstruments();
    this.mixer.reset();
    this.nextBeatIndex = 0;
  }

  get playing() {
    return this.interval != null;
  }

  public getBeatIndex() {
    const beatTime = 60. / this.machine.bpm;
    return this.mixer.getCurrentTime() / beatTime;
  }

  private timeToNextBeat() {
    const beatTime = 60. / this.machine.bpm;
    return this.mixer.getCurrentTime() % beatTime;
  }

  private beatTick() {
    // this timer will cause the beat display to update
    this.beatTimer = setTimeout(() => this.beatTick(), this.timeToNextBeat());
  }
}
