import { autorun } from 'mobx';
import { IInstrument } from './machine-interfaces';

export class InstrumentPlayer {
  private gainNode: GainNode;
  private gainMap: {
    [velocity: number]: GainNode;
  } = {};

  constructor(private context: AudioContext, private instrument: IInstrument) {
    this.gainNode = this.createGainNode();
    this.reset();

    autorun(() => this.updateGain());
  }

  reset() {
    if (this.gainNode) {
      this.gainNode.disconnect();
    }
    this.gainNode = this.createGainNode();
    this.updateGain();
    this.gainMap = {};
  }

  private createGainNode() {
    const gainNode = this.context.createGain();
    gainNode.connect(this.context.destination);
    return gainNode;
  }

  private updateGain() {
    this.gainNode.gain.value = this.instrument.enabled ? this.instrument.volume : 0;
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
}
