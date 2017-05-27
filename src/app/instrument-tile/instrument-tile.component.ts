import { Component, OnInit, Input } from '@angular/core';
import { IInstrument } from './../engine/machine-interfaces';

@Component({
  selector: 'bm-instrument-tile',
  templateUrl: './instrument-tile.component.html',
  styleUrls: ['./instrument-tile.component.css']
})
export class InstrumentTileComponent implements OnInit {
  @Input() instrument: IInstrument;

  constructor() { }

  ngOnInit() {
  }

}
