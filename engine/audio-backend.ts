import { InstrumentPlayer } from './instrument-player';

interface BankDescriptor {
  [sampleName: string]: number[];
}

export class AudioBackend {
  public ready: boolean;
  private buffer?: AudioBuffer;
  private bankDescriptor?: BankDescriptor;
  private zeroTime: number | null = null;
  private _context?: AudioContext;

  constructor() {
    this.ready = false;
    const hasWebM = typeof MediaSource !== 'undefined' && MediaSource.isTypeSupported('audio/webm;codecs="vorbis"');
    this.loadBank(hasWebM ? 'assets/audio/main.webm' : 'assets/audio/main.mp3');
    this.loadBankDescriptor('assets/audio/main.json');
  }

  init(context = typeof AudioContext !== 'undefined' ? new AudioContext() : undefined) {
    this._context = context;
  }

  get context() {
    return this._context;
  }

  private async loadBank(url: string) {
    // on Safari we need to use callbacks using decodeAudioData method.
    const req = await fetch(url);
    const response = await req.arrayBuffer();
    this.buffer = await new Promise((resolve, reject) => {
      this.context?.decodeAudioData(response, resolve, reject);
    });
    this.ready = true;
  }

  private async loadBankDescriptor(url: string) {
    const req = await fetch(url);
    this.bankDescriptor = await req.json();
  }

  play(sampleName: string, player: InstrumentPlayer, when: number, velocity?: number) {
    const bufferSource = this.context!.createBufferSource();
    bufferSource.connect(player.createNoteDestination(velocity));
    bufferSource.buffer = this.buffer!;
    const sampleInfo = this.bankDescriptor![sampleName];
    if (this.zeroTime === null) {
      this.zeroTime = this.context!.currentTime;
    }
    const startTime = this.zeroTime + when;
    bufferSource.start(startTime, sampleInfo[1] / 44100.0, sampleInfo[2] / 44100.0);
    player.registerSample(bufferSource, startTime);
  }

  reset() {
    this.zeroTime = null;
  }

  getCurrentTime(): number {
    if (this.zeroTime == null) {
      return 0;
    }
    return this.context!.currentTime - this.zeroTime;
  }
}
