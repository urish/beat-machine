import { MagicBlueService } from './../magic-blue.service';
import { Component, OnInit, Input } from '@angular/core';
import { BeatEngineService } from './../engine/beat-engine.service';
import { PurpleEyeService } from './../purple-eye.service';
import { dance } from './moves';

@Component({
  selector: 'bm-robot-connector',
  templateUrl: './robot-connector.component.html',
  styleUrls: ['./robot-connector.component.css']
})
export class RobotConnectorComponent implements OnInit {
  connected = false;

  constructor(
    private purpleEye: PurpleEyeService,
    private magicBulb: MagicBlueService,
    private engine: BeatEngineService,
  ) { }

  ngOnInit() {
  }

  async connectRobot() {
    await this.purpleEye.connect();
    this.connected = true;
    this.engine.beat
      .map(beat => Math.floor((beat + 0.25) % 8) + 1)
      .distinctUntilChanged()
      .subscribe(beat => {
        const move = dance(beat);
        this.purpleEye.move(move[0], move[1], move[2], move[3]);
      });
  }

  async connectBulb() {
    await this.magicBulb.connect();
    this.engine.beat
      .map(beat => Math.floor((beat + 0.25)))
      .distinctUntilChanged()
      .subscribe(beat => {
        if (beat % 2) {
          this.magicBulb.setColor(255, 0, 0);
        } else {
          this.magicBulb.setColor(0, 255, 0);
        }
      });
  }
}
