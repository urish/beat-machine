import { Component } from '@angular/core';
import { Http } from '@angular/http';

import { BeatEngineService } from './beat-engine.service';
import { IMachine } from './machine-interfaces';
import { XMLLoaderService } from './xml-loader.service';

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
}
