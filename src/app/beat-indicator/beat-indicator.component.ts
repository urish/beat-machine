/// <reference types="web-bluetooth" />

import { Component, Input } from '@angular/core';

const bulb = navigator.bluetooth.requestDevice({ filters: [{ services: [0xffe5] }] })
  .then(device => device.gatt.connect())
  .then(gatt => gatt.getPrimaryService(0xffe5))
  .then(service => service.getCharacteristic(0xffe9));

const purpleEye = navigator.bluetooth.requestDevice({ filters: [{ services: [0x5100] }], optionalServices: ['battery_service'] })
  .then(device => {
    console.log('found purple eye!');
    return device.gatt.connect();
  })
  .then(gatt => gatt.getPrimaryService(0x5100))
  .then(service => service.getCharacteristic(0x5200));

function dance(beat) {
  switch (beat) {
    case 8: return [90 - 20, 90, 90, 90 - 20];
    case 1: return [90 - 20, 90, 90 - 25, 90 - 20];
    case 2:
    case 3: return [90, 90, 90, 90];
    case 4: return [90 + 20, 90 - 15, 90, 90 + 20];
    case 5: return [90 + 20, 90, 90, 90 + 20];
    case 6:
    case 7: return [90, 90, 90, 90];
  }
}

function floor(beat) {
  switch (beat) {
    case 8: return [90 - 20, 90, 90, 90 - 20];
    case 1: return [90, 90, 90, 90];
    case 2:
    case 3: return [90 - 20, 90, 90, 90 - 20];

    case 4: return [90 + 20, 90, 90, 90 + 20];
    case 5: return [90, 90, 90, 90];
    case 6:
    case 7: return [90 + 20, 90, 90, 90 + 20];
  }
}

function shimmy(beat) {
  switch (beat) {
    case 8: return [90 - 20, 90, 90, 90 - 20];
    case 1: return [90, 90, 90, 90];
    case 2:
    case 3: return [90 - 20, 90, 90, 90 - 20];

    case 4: return [90 + 15, 90, 90, 90 - 15];
    case 5: return [90 - 15, 90, 90, 90 + 15];
    case 6:
    case 7: return [90 + 15, 90, 90, 90 - 15];
  }
}

function merengue(beat) {
  switch (beat) {
    case 1: return [90 + 15, 90, 90, 90 - 15];
    case 2: return [90 - 15, 90, 90, 90 + 15];
    case 3: return [90 + 15, 90, 90, 90 - 15];
    case 4: return [90 - 15, 90, 90, 90 + 15];
  }
}

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
  private purpleChar: BluetoothRemoteGATTCharacteristic;

  constructor() {
    bulb.then(char => this.char = char);
    purpleEye.then(char => this.purpleChar = char);
  }

  async ngOnChanges() {
    const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));
    const swiv = this.index;
    if (this.purpleChar) {
      const move = (window as any).mv ? (window as any).mv(this.index) : dance(this.index);
      this.purpleChar.writeValue(new Uint8Array(move));
    }
    if (this.char) {
      if (this.index === 8 || this.index === 4) {
        await sleep(250);
        await this.char.writeValue(new Uint8Array([0x56, this.index === 8 ? 150 : 0, this.index === 4 ? 150 : 0, 0, 0x00, 0xf0, 0xaa]));
        await sleep(1000);
        await this.char.writeValue(new Uint8Array([0x56, 0, 0, 0, 0x00, 0xf0, 0xaa]));
      }
    }
  }

  beats = [1, 2, 3, 4, 5, 6, 7, 8];
}
