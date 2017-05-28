/// <reference types="web-bluetooth" />

import { Injectable } from '@angular/core';

@Injectable()
export class PurpleEyeService {

  characteristic: BluetoothRemoteGATTCharacteristic;

  constructor() { }

  async connect() {
    const device = await navigator.bluetooth.requestDevice({
      filters: [{ services: [0x5100] }],
      optionalServices: ['battery_service']
    });
    const gatt = await device.gatt.connect();
    const service = await gatt.getPrimaryService(0x5100);
    this.characteristic = await service.getCharacteristic(0x5200);
  }

  async move(leftLeg: number, leftFoot: number, rightLeg: number, rightFoot: number) {
    await this.characteristic.writeValue(new Uint8Array([leftLeg, leftFoot, rightLeg, rightFoot]));
  }
}
