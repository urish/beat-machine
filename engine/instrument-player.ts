import { autorun, IReactionDisposer } from 'mobx';
import { IInstrument } from './machine-interfaces';

export class InstrumentPlayer {
  private gainNode: GainNode;
  private gainMap: {
    [velocity: number]: GainNode;
  } = {};
  private scheduledSamples = new Map<AudioScheduledSourceNode, number>();
  private disposer: IReactionDisposer;

  constructor(private context: AudioContext, private instrument: IInstrument) {
    this.gainNode = context.createGain();
    this.gainNode.connect(this.context.destination);

    this.disposer = autorun(() => {
      this.gainNode.gain.value = this.instrument.enabled ? this.instrument.volume : 0;
    });
  }

  reset(hard = false) {
    for (const [sample, startTime] of Array.from(this.scheduledSamples.entries())) {
      if (hard || startTime >= this.context.currentTime) {
        sample.stop();
      }
    }
    this.scheduledSamples.clear();
  }

  createNoteDestination(velocity?: number): AudioNode {
    if (typeof velocity !== 'number' || velocity === 1.0) {
      return this.gainNode;
    }
    if (!this.gainMap[velocity]) {
      const newNode = this.context.createGain();
      newNode.connect(this.gainNode);
      newNode.gain.value = velocity;
      this.gainMap[velocity] = newNode;
    }
    return this.gainMap[velocity];
  }

  registerSample(buffer: AudioScheduledSourceNode, startTime: number) {
    buffer.addEventListener('ended', () => {
      this.scheduledSamples.delete(buffer);
    });
    this.scheduledSamples.set(buffer, startTime);
  }

  dispose() {
    this.disposer();
    this.reset(true);
  }
}
