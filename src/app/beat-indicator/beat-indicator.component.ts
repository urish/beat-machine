/// <reference types="web-bluetooth" />

import { Component, Input } from '@angular/core';

const bulb = navigator.bluetooth.requestDevice({ filters: [{ services: [0xffe5] }] })
  .then(device => device.gatt.connect())
  .then(gatt => gatt.getPrimaryService(0xffe5))
  .then(service => service.getCharacteristic(0xffe9));

@Component({
  selector: 'bm-beat-indicator',
  templateUrl: './beat-indicator.component.html',
  styleUrls: ['./beat-indicator.component.css']
})
export class BeatIndicatorComponent {
  @Input() index = 0;
  @Input() set max(value: number) {
    this.beats = [];
    for (let i = 1; i <= value; i++) {
      this.beats.push(i);
    }
  }

  private char: BluetoothRemoteGATTCharacteristic;

  constructor() {
    bulb.then(char => this.char = char);
  }

  async ngOnChanges() {
    const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));
    if (this.char) {
      if (this.index === 8 || this.index === 4) {
        console.log('tic');
        await sleep(250);
        await this.char.writeValue(new Uint8Array([0x56, this.index === 8 ? 150 : 0, this.index === 4 ? 150 : 0, 0, 0x00, 0xf0, 0xaa]));
        await sleep(100);
        await this.char.writeValue(new Uint8Array([0x56, 0, 0, 0, 0x00, 0xf0, 0xaa]));
      } else {
      }
    }
  }

  beats = [1, 2, 3, 4, 5, 6, 7, 8];
}
