import { Injectable } from '@angular/core';
import { Http, ResponseContentType } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import 'rxjs/add/operator/mergeMap';
import 'rxjs/add/observable/fromPromise';

import { IInstrument } from './machine-interfaces';

export class PropertyWatcher<T> {
  private value: T;
  private watchers: Function[];

  constructor(obj: any, propertyName: string) {
    this.value = obj[propertyName];
    this.watchers = [];
    Object.defineProperty(obj, propertyName, {
      get: () => this.value,
      set: newValue => {
        this.value = newValue;
        this.watchers.forEach(watcher => watcher(newValue));
      }
    });
  }

  public register(fn: Function) {
    this.watchers.push(fn);
  }
}

export class InstrumentPlayer {
  private gain: GainNode;
  private volume: number;
  private enabled: boolean;
  private gainMap: {
    [velocity: number]: GainNode
  };

  onChange = new Subject();

  constructor(private context: AudioContext, private instrument: IInstrument) {
    this.reset();

    new PropertyWatcher(instrument, 'volume').register(newValue => {
      if (instrument.enabled) {
        this.gain.gain.value = newValue;
      }
    });

    new PropertyWatcher(instrument, 'enabled').register(enabled => {
      if (enabled) {
        this.reset();
        this.onChange.next();
      } else {
        this.gain.gain.value = 0;
      }
    });

    new PropertyWatcher(instrument, 'activeProgram').register(activeProgram => {
      this.reset();
      this.onChange.next();
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

@Injectable()
export class AudioBackendService {

  public ready: boolean;
  private buffer: AudioBuffer;
  private bankDescriptor: any;
  private zeroTime: number = null;
  private _context: AudioContext;

  constructor(private http: Http) {
    this.ready = false;
    this.loadBank('assets/audio/main.wav');
    this.loadBankDescriptor('assets/audio/main.json');
  }

  init(context = new AudioContext()) {
    this._context = context;
  }

  get context() {
    return this._context;
  }

  private loadBank(url: string) {
    this.http.get(url, { responseType: ResponseContentType.ArrayBuffer })
      .mergeMap(result => Observable.fromPromise(this.context.decodeAudioData(result.arrayBuffer())))
      .subscribe(buffer => {
        this.buffer = buffer;
        this.ready = true;
      });
  }

  private loadBankDescriptor(url: string) {
    this.http.get(url)
      .subscribe(response => {
        this.bankDescriptor = response.json();
      });
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
