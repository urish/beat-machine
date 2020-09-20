import { autorun } from 'mobx';
import { IInstrument } from './machine-interfaces';

export class InstrumentPlayer {
  private gain: GainNode;
  private gainMap: {
    [velocity: number]: GainNode;
  } = {};

  constructor(private context: AudioContext, private instrument: IInstrument) {
    this.gain = this.createGainNode();
    this.reset();

    autorun(() => {
      const gainNode = this.gain;
      if (gainNode) {
        gainNode.gain.value = instrument.enabled ? instrument.volume : 0;
      }
    });
  }

  reset() {
    if (this.gain) {
      this.gain.disconnect();
    }
    this.gain = this.createGainNode();
    this.gainMap = {};
  }

  private createGainNode() {
    const gainNode = this.context.createGain();
    gainNode.connect(this.context.destination);
    return gainNode;
  }

  createNoteDestination(velocity?: number): AudioNode {
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
