import { Injectable } from '@angular/core';

@Injectable()
export class MipService {

  characteristic: BluetoothRemoteGATTCharacteristic;

  constructor() { }

  async connect() {
    const device = await navigator.bluetooth.requestDevice({
      filters: [{ services: [0xfff0] }],
      optionalServices: [0xffe5]
    });
    const gatt = await device.gatt.connect();
    const service = await gatt.getPrimaryService(0xffe5);
    this.characteristic = await service.getCharacteristic(0xffe9);
  }

  async forward(speed = 0x10, time = 0xb8) {
    await this.characteristic.writeValue(
      new Uint8Array([0x71, speed, time]));
  }

  async backward(speed = 0x10, time = 0xb8) {
    await this.characteristic.writeValue(
      new Uint8Array([0x71, speed, time]));
  }

  async turnLeft(angle = 90, speed = 20) {
    await this.characteristic.writeValue(
      new Uint8Array([0x73, Math.round(angle / 5), speed]));
  }

  async turnRight(angle = 90, speed = 20) {
    await this.characteristic.writeValue(
      new Uint8Array([0x74, Math.round(angle / 5), speed]));
  }
}
