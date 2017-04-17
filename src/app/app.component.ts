import { Component } from '@angular/core';
import { Http } from '@angular/http';

import { BeatEngineService } from './beat-engine.service';
import { IMachine } from './machine-interfaces';
import { XMLLoaderService } from './xml-loader.service';

@Component({
  selector: 'app-root',
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

  beatIndex() {
    const beatIndex = Math.round((0.5 + this.engine.getBeatIndex() % 8));
    if (beatIndex !== this.lastBeatIndex) {
      setTimeout(() => {
        this.lastBeatIndex = beatIndex;
      }, 0);
    }
    return this.lastBeatIndex;
  }
}
