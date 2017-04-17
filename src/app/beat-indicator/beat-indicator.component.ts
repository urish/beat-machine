import { Component, Input } from '@angular/core';

@Component({
  selector: 'bm-beat-indicator',
  templateUrl: './beat-indicator.component.html',
  styleUrls: ['./beat-indicator.component.css']
})
export class BeatIndicatorComponent {
  @Input() index = 0;

  beats = [1, 2, 3, 4, 5, 6, 7, 8];
}
