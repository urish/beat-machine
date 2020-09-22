import { Machine } from './machine';
import { IMachine, IInstrument, IProgram } from './machine-interfaces';

export class MachineXMLLoader {
  private NS_BEAT_MACHINE = 'http://www.salsabeatmachine.org/xns/bm';
  private NS_INSTRUMENTS = 'http://www.salsabeatmachine.org/xns/instruments';

  loadMachine(xmlDocument: Document): IMachine {
    const machineElement = xmlDocument.getElementsByTagNameNS(this.NS_BEAT_MACHINE, 'Machine')[0];
    const machine: IMachine = new Machine();

    const processors: {
      [key: string]: (node: Element) => any;
    } = {
      bpm: (node) => (machine.bpm = parseInt(node.textContent!, 10)),
      keyNote: (node) => (machine.keyNote = parseInt(node.textContent!, 10)),
      flavor: (node) => (machine.flavor = node.textContent as any),
      instrumentList: (node) => (machine.instruments = this.processInstrumentList(node)),
    };

    this.childElements(machineElement).forEach((element) => {
      const processor = processors[element.localName!];
      if (processor && element.namespaceURI === this.NS_BEAT_MACHINE) {
        processor(element);
      }
    });
    return machine;
  }

  public loadInstrument(element: Element): IInstrument {
    const children = this.childElements(element).filter((node) => node.namespaceURI === this.NS_INSTRUMENTS);

    function childValue(name: string, defaultValue: string): string {
      const child = children.filter((candidate) => candidate.localName === name)[0];
      return child && child.textContent ? child.textContent : defaultValue;
    }

    const result: IInstrument = {
      id: (element.localName || '').toLowerCase(),
      title: element.getAttribute('title') || '',
      enabled: childValue('enabled', 'false') === 'true',
      activeProgram: parseInt(childValue('activeProgram', '0'), 10),
      programs: [],
      respectsClave: childValue('respectsClave', 'false') === 'true',
      keyedInstrument: childValue('keyedInstrument', 'false') === 'true',
      pitchOffset: parseInt(childValue('pitchOffset', '0'), 10),
      playBothHands: childValue('playBothHands', 'false') === 'true',
      leftHandPitchOffset: parseInt(childValue('leftHandPitchOffset', '0'), 10),
      volume: parseFloat(childValue('volume', '1.0')),
    };

    const programs = children.filter((node) => node.localName === 'programs')[0];
    if (programs) {
      result.programs = this.childElements(programs)
        .filter((node) => node.namespaceURI === this.NS_BEAT_MACHINE && node.localName === 'Program')
        .map((node) => this.loadProgram(node));
    }

    return result;
  }

  loadProgram(element: Element): IProgram {
    return {
      title: element.getAttribute('title') || '',
      length: parseInt(element.getAttribute('length')!, 10) || 0,
      notes: this.childElements(element)
        .filter((node) => node.namespaceURI === this.NS_BEAT_MACHINE && node.localName === 'Note')
        .map((noteElement) => ({
          index: parseInt(noteElement.getAttribute('index')!, 10) || 0,
          pitch: parseInt(noteElement.getAttribute('pitch')!, 10) || 0,
          velocity: parseFloat(noteElement.getAttribute('velocity')!) || undefined,
        })),
    };
  }

  private processInstrumentList(instrumentList: Node): IInstrument[] {
    return this.childElements(instrumentList)
      .filter((node) => node.namespaceURI === this.NS_INSTRUMENTS)
      .map((node) => this.loadInstrument(node));
  }

  private childElements(node: Node): Element[] {
    return (Array.from(node.childNodes) as Element[]).filter((candidate) => candidate.nodeType === Node.ELEMENT_NODE);
  }
}
