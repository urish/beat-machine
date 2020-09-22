import { useEffect, useState } from 'react';
import { IMachine } from '../engine/machine-interfaces';
import { MachineXMLLoader } from '../engine/machine-xml-loader.service';

export function useMachine(url: string) {
  const [machine, setMachine] = useState<IMachine | null>(null);

  const loadMachine = async () => {
    const req = await fetch(url);
    const resp = await req.text();
    const xml = new DOMParser().parseFromString(resp, 'text/xml');
    const loader = new MachineXMLLoader();
    setMachine(loader.loadMachine(xml));
  };

  useEffect(() => {
    loadMachine();
  }, []);
  return machine;
}
