import { observable } from 'mobx';
import { IInstrument, IMachine } from './machine-interfaces';

export class Machine implements IMachine {
  @observable bpm: number = 180;
  @observable keyNote: number = 0;
  @observable instruments: IInstrument[] = [];
  @observable flavor: 'Salsa' | 'Merengue' = 'Salsa';
}
