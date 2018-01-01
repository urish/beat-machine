import { Component, Input } from '@angular/core';

@Component({
  selector: 'bm-beat-indicator',
  templateUrl: '/app/beat-indicator/beat-indicator.component.html',
  styleUrls: ['/app/beat-indicator/beat-indicator.component.css']
})
export class BeatIndicatorComponent {
  @Input() index = 0;
  @Input() set max(value: number) {
    this.beats = [];
    for (let i = 1; i <= value; i++) {
      this.beats.push(i);
    }
  }

  beats = [1, 2, 3, 4, 5, 6, 7, 8];
}
