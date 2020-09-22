import { IMachine } from './machine-interfaces';

export function createMachine(): IMachine {
  return { bpm: 180, keyNote: 0, instruments: [], flavor: 'Salsa' };
}
