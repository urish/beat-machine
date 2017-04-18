export interface INote {
  index: number;
  pitch: number;
  velocity?: number;
  pianoTonic?: boolean;
  hand?: 'right' | 'left';
}

export interface IProgram {
  title: string;
  length: number;
  notes: INote[];
}

export interface IInstrument {
  id: string;
  title: string;
  enabled: boolean;
  activeProgram: number;
  programs: IProgram[];
  respectsClave: boolean;
  pitchOffset: number;
  keyedInstrument: boolean;
  playBothHands: boolean;
  leftHandPitchOffset: number;
  volume: number;
}

export interface IMachine {
  bpm: number;
  keyNote: number;
  instruments: IInstrument[];
}
