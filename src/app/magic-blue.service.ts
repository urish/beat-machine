import { Injectable } from '@angular/core';

@Injectable()
export class MagicBlueService {

  characteristic: BluetoothRemoteGATTCharacteristic;

  constructor() { }

  async connect() {
    const device = await navigator.bluetooth.requestDevice({
      filters: [{ services: [0xffe5] }]
    });
    const gatt = await device.gatt.connect();
    const service = await gatt.getPrimaryService(0xffe5);
    this.characteristic = await service.getCharacteristic(0xffe9);
  }

  async setColor(red: number, green: number, blue: number) {
    await this.characteristic.writeValue(
      new Uint8Array([0x56, red, green, blue, 0x00, 0xf0, 0xaa]));
  }
}
