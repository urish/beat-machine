import { MagicBlueService } from './../magic-blue.service';
import { Component, OnInit, Input } from '@angular/core';
import { BeatEngineService } from './../engine/beat-engine.service';
import { PurpleEyeService } from './../purple-eye.service';
import { dance, animateBulb } from './moves';

declare var require: any;

@Component({
  selector: 'bm-robot-connector',
  templateUrl: './robot-connector.component.html',
  styleUrls: ['./robot-connector.component.css']
})
export class RobotConnectorComponent implements OnInit {
  connected = false;
  danceFn = dance;
  bulbFn = animateBulb;

  constructor(
    private purpleEye: PurpleEyeService,
    private magicBulb: MagicBlueService,
    private engine: BeatEngineService,
  ) {
    (module as any).hot.accept('./moves.ts', () => {
      console.log('moves reload!');
      const { dance, animateBulb } = require('./moves.ts');
      this.danceFn = dance;
      this.bulbFn = animateBulb;
    });
  }

  ngOnInit() {
  }

  async connectRobot() {
    await this.purpleEye.connect();
    this.connected = true;
    this.engine.beat
      .map(beat => Math.floor((beat + 0.25) % 8) + 1)
      .distinctUntilChanged()
      .subscribe(beat => {
        const move = this.danceFn(beat);
        this.purpleEye.move(move[0], move[1], move[2], move[3]);
      });
  }

  async connectBulb() {
    await this.magicBulb.connect();
    this.engine.beat
      .map(beat => Math.floor((beat + 0.25)))
      .distinctUntilChanged()
      .subscribe(beat => {
        const animation = this.bulbFn(beat);
        this.magicBulb.setColor(animation.r, animation.g, animation.b);
      });
  }
}
