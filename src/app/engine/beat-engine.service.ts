import { INoteSpec } from './beat-engine.service';
import { Injectable, NgZone } from '@angular/core';
import { IMachine, IInstrument } from './machine-interfaces';
import { AudioBackendService, InstrumentPlayer, PropertyWatcher } from './audio-backend.service';

export interface INoteSpec {
  beatOffset: number;
  sampleName: string;
  velocity?: number;
}

@Injectable()
export class BeatEngineService {
  private nextBeatIndex: number;

  private interval: number;
  private beatTimer: number;
  private instrumentPlayers;
  private _machine: IMachine;

  constructor(private zone: NgZone, private mixer: AudioBackendService) {
    this.mixer.init();
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
              this.stopAllInstruments();
              this.mixer.reset();
              this.nextBeatIndex = 0;
              this.scheduleBuffers();
            }
          });

        new PropertyWatcher(this.machine, 'keyNote')
          .register(newValue => {
            if (this.playing) {
              this.machine.instruments
                .filter(instrument => instrument.keyedInstrument)
                .map(instrument => this.rescheduleInstrument(instrument));
            }
          });
      }
    }
  }

  public start() {
    this.scheduleBuffers();
    this.beatTick();
  }

  private scheduleBuffers() {
    if (this.mixer.ready) {
      const beatTime = 60. / this.machine.bpm;
      while (this.nextBeatIndex - this.getBeatIndex() < 32) {
        const beatIndex = this.nextBeatIndex;
        this.machine.instruments.forEach(instrument => {
          let instrumentPlayer = this.instrumentPlayers[instrument.id];
          if (!instrumentPlayer) {
            instrumentPlayer = new InstrumentPlayer(this.mixer.context, instrument);
            instrumentPlayer.onChange.subscribe(() => {
              this.rescheduleInstrument(instrument);
            });
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
    this.zone.runOutsideAngular(() => {
      this.interval = setTimeout(() => this.scheduleBuffers(), 1000);
    });
  }

  rescheduleInstrument(instrument: IInstrument) {
    const player = this.instrumentPlayers[instrument.id];
    player.reset();
    const beatTime = 60. / this.machine.bpm;
    for (let beatIndex = Math.round(this.getBeatIndex()); beatIndex < this.nextBeatIndex; beatIndex++) {
      this.instrumentNotes(instrument, beatIndex).forEach(note => {
        this.mixer.play(note.sampleName, player, (beatIndex + note.beatOffset) * beatTime, note.velocity);
      });
    }
  }

  private instrumentNotes(instrument: IInstrument, beatIndex: number): INoteSpec[] {
    const result: INoteSpec[] = [];
    if (instrument.enabled) {
      const program = instrument.programs[instrument.activeProgram];
      beatIndex = beatIndex % (program.length / 2);
      program.notes
        .filter(note => (note.index === beatIndex * 2) || (note.index === beatIndex * 2 + 1))
        .forEach(note => {
          let pitch = note.pitch;
          const beatOffset = note.index === beatIndex * 2 ? 0 : 0.5;
          if (instrument.keyedInstrument) {
            pitch += this.machine.keyNote;
          }
          if (note.hand !== 'left') {
            result.push({
              sampleName: instrument.id + '-' + (pitch + instrument.pitchOffset),
              beatOffset,
              velocity: note.velocity
            });
            if (note.pianoTonic) {
              result.push({
                sampleName: instrument.id + '-' + (pitch + instrument.pitchOffset + 12),
                beatOffset,
                velocity: note.velocity
              });
            }
          }
          if (instrument.playBothHands && note.hand !== 'right') {
            result.push({
              sampleName: instrument.id + '-' + (pitch + instrument.leftHandPitchOffset),
              beatOffset,
              velocity: note.velocity
            });
          }
        });
    }
    return result;
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
    // This timer will cause angular change detection, and therefore update the beat display
    this.beatTimer = setTimeout(() => this.beatTick(), this.timeToNextBeat());
  }
}
