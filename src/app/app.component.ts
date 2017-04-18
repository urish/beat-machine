import { Component } from '@angular/core';
import { Http } from '@angular/http';

import { BeatEngineService } from './engine/beat-engine.service';
import { IMachine } from './engine/machine-interfaces';
import { XMLLoaderService } from './engine/xml-loader.service';

@Component({
  selector: 'bm-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  machine: IMachine;
  lastBeatIndex: number;

  constructor(http: Http, loader: XMLLoaderService, public engine: BeatEngineService) {
    http.get('assets/salsa.xml').subscribe(value => {
      const xml = (new DOMParser()).parseFromString(value.text(), 'text/xml');
      this.machine = loader.loadMachine(xml);
      engine.machine = this.machine;
    });
  }

  togglePlay() {
    if (this.engine.playing) {
      this.engine.stop();
    } else {
      this.engine.start();
    }
  }

  beatIndex() {
    const beatIndex = this.engine.playing ? Math.round((0.5 + this.engine.getBeatIndex() % 8)) : 0;
    if (beatIndex !== this.lastBeatIndex) {
      setTimeout(() => {
        this.lastBeatIndex = beatIndex;
      }, 0);
    }
    return this.lastBeatIndex;
  }

  onKeyDown(event: KeyboardEvent) {
    switch (event.key) {
      case '+': case '=':
        this.machine.bpm += Math.min(250, this.machine.bpm + 5);
        break;

      case '-':
        this.machine.bpm = Math.max(80, this.machine.bpm - 5);
        break;

      case 'k':
        this.machine.keyNote = (this.machine.keyNote + 7) % 12;
        break;

      case 'K':
        this.machine.keyNote = (this.machine.keyNote + 5) % 12;
    }
    if (event.key >= '0' && event.key <= '9') {
      const index = (parseInt(event.key, 10) + 10 - 1) % 10;
      const instrument = this.machine.instruments[index];
      if (event.altKey) {
        instrument.activeProgram = (instrument.activeProgram + 1) % instrument.programs.length;
      } else {
        instrument.enabled = !instrument.enabled;
      }
    }
  }
}
