import { promises as fs } from 'fs';
import { resolve } from 'path';
import { DOMParser } from 'xmldom';
import { MachineXMLLoader } from '../engine/machine-xml-loader.service';

export async function loadMachine(fileName: string) {
  const fullPath = resolve(process.cwd(), 'public/assets/machines', fileName);
  const machineXml = await fs.readFile(fullPath, 'utf-8');
  const xml = new DOMParser().parseFromString(machineXml, 'text/xml');
  const loader = new MachineXMLLoader();
  return JSON.parse(JSON.stringify(loader.loadMachine(xml)));
}
