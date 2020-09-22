import { computed, Lambda, observable, observe } from 'mobx';
import { AudioBackend } from './audio-backend';
import { InstrumentPlayer } from './instrument-player';
import { createMachine } from './machine';
import { IInstrument, IMachine } from './machine-interfaces';

export interface IInstrumentSample {
  sampleName: string;
  velocity?: number;
}

export class BeatEngine {
  private nextSampleIndex = 0;
  private animationFrameRequest: number | null = null;
  private audioTimeDelta = 0;
  private machineDisposers: Lambda[] = [];
  private readonly instrumentPlayers = new Map<IInstrument, InstrumentPlayer>();

  @observable
  private interval: number | null = null;

  @observable
  private _machine: IMachine = createMachine();

  @observable
  beat = 0;

  constructor(private mixer: AudioBackend) {
    this.mixer.init();
  }

  get machine() {
    return this._machine;
  }

  set machine(value: IMachine) {
    if (value !== this._machine) {
      this._machine = value;
      this.machineDisposers.forEach((disposer) => disposer());
      this.machineDisposers = [];
      for (const player of Array.from(this.instrumentPlayers.values())) {
        player.dispose();
      }
      this.instrumentPlayers.clear();

      if (!this.machine) {
        return;
      }
      if (this.playing) {
        this.stop();
        this.play();
      }

      this.machineDisposers.push(
        observe(this.machine, 'bpm', ({ oldValue, newValue }) => {
          if (this.playing) {
            if (this.interval) {
              clearTimeout(this.interval);
            }
            const currentAudioTime = this.mixer.getCurrentTime();
            if (oldValue != null) {
              this.audioTimeDelta = (currentAudioTime + this.audioTimeDelta) * (oldValue / newValue) - currentAudioTime;
            }
            this.nextSampleIndex = Math.ceil(this.getBeatIndex() * 2);
            this.stopAllInstruments();
            this.scheduleBuffers();
          }
        }),

        observe(this.machine, 'keyNote', () => {
          if (this.playing) {
            for (const instrument of this.machine.instruments) {
              if (!instrument.keyedInstrument) {
                continue;
              }
              const player = this.instrumentPlayers.get(instrument);
              if (player) {
                this.rescheduleInstrument(instrument, player);
              }
            }
          }
        }),
      );
    }
  }

  public play() {
    this.mixer.context?.resume();
    this.scheduleBuffers();
    this.beatTick();
  }

  private getInstrumentPlayer(context: AudioContext, instrument: IInstrument) {
    const instrumentPlayer = this.instrumentPlayers.get(instrument);
    if (instrumentPlayer) {
      return instrumentPlayer;
    } else {
      const newPlayer = new InstrumentPlayer(context, instrument);
      this.machineDisposers.push(
        observe(instrument, 'activeProgram', () => this.rescheduleInstrument(instrument, newPlayer)),
      );
      this.instrumentPlayers.set(instrument, newPlayer);
      return newPlayer;
    }
  }

  private scheduleBuffers() {
    const context = this.mixer.context;
    if (context && this.mixer.ready) {
      const sampleTime = this.beatTime / 2;
      const currentBeat = this.getBeatIndex();
      while (this.nextSampleIndex - currentBeat * 2 < 64) {
        const sampleIndex = this.nextSampleIndex;
        this.machine.instruments.forEach((instrument) => {
          const instrumentPlayer = this.getInstrumentPlayer(context, instrument);
          this.instrumentNotes(instrument, sampleIndex).forEach((note) => {
            this.mixer.play(
              note.sampleName,
              instrumentPlayer,
              sampleIndex * sampleTime - this.audioTimeDelta,
              note.velocity,
            );
          });
        });
        this.nextSampleIndex++;
      }
    } else {
      console.log('Mixer not ready yet');
    }
    this.interval = window.setTimeout(() => this.scheduleBuffers(), 1000);
  }

  rescheduleInstrument(instrument: IInstrument, player: InstrumentPlayer) {
    player.reset();
    const sampleTime = this.beatTime / 2;
    for (let sampleIndex = Math.ceil(this.getBeatIndex() * 2); sampleIndex < this.nextSampleIndex; sampleIndex++) {
      this.instrumentNotes(instrument, sampleIndex).forEach((note) => {
        this.mixer.play(note.sampleName, player, sampleIndex * sampleTime - this.audioTimeDelta, note.velocity);
      });
    }
  }

  private instrumentNotes(instrument: IInstrument, sampleIndex: number): IInstrumentSample[] {
    const result: IInstrumentSample[] = [];
    if (instrument.enabled) {
      const program = instrument.programs[instrument.activeProgram];
      sampleIndex %= program.length;
      program.notes
        .filter((note) => note.index === sampleIndex)
        .forEach((note) => {
          let pitch = note.pitch;
          if (instrument.keyedInstrument) {
            pitch += this.machine.keyNote;
          }
          if (note.hand !== 'left') {
            result.push({
              sampleName: instrument.id + '-' + (pitch + instrument.pitchOffset),
              velocity: note.velocity,
            });
            if (note.pianoTonic) {
              result.push({
                sampleName: instrument.id + '-' + (pitch + instrument.pitchOffset + 12),
                velocity: note.velocity,
              });
            }
          }
          if (instrument.playBothHands && note.hand !== 'right') {
            result.push({
              sampleName: instrument.id + '-' + (pitch + instrument.leftHandPitchOffset),
              velocity: note.velocity,
            });
          }
        });
    }
    return result;
  }

  private stopAllInstruments(hard = false) {
    for (const instrument of Array.from(this.instrumentPlayers.values())) {
      instrument.reset(hard);
    }
  }

  public stop() {
    if (this.interval) {
      clearTimeout(this.interval);
      this.interval = null;
    }
    if (this.animationFrameRequest) {
      cancelAnimationFrame(this.animationFrameRequest);
      this.animationFrameRequest = null;
    }
    this.stopAllInstruments(true);
    this.mixer.reset();
    this.audioTimeDelta = 0;
    this.nextSampleIndex = 0;
  }

  @computed
  get playing() {
    return this.interval != null;
  }

  get beatTime() {
    const result = 60 / this.machine.bpm;
    return this.machine.flavor === 'Merengue' ? result / 2 : result;
  }

  public getBeatIndex() {
    return (this.mixer.getCurrentTime() + this.audioTimeDelta) / this.beatTime;
  }

  private beatTick() {
    this.beat = this.getBeatIndex();
    this.animationFrameRequest = requestAnimationFrame(() => this.beatTick());
  }
}
