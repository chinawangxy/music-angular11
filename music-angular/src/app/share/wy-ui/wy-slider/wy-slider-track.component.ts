import {
  ChangeDetectionStrategy,
  Component,
  Input,
  OnChanges,
  OnInit,
  SimpleChanges,
} from '@angular/core';
import { WySliderStyle } from './wy-slider-types';

@Component({
  selector: 'app-wy-slider-track',
  template:
    '<div class="wy-slider-track" [class.buffer]="wyBuffer" [ngStyle]="style"></div>',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WySliderTrackComponent implements OnInit, OnChanges {
  @Input() wyVertial = false;
  @Input() wyLength: number;
  @Input() wyBuffer = false;

  style: WySliderStyle = {};
  constructor() {}

  ngOnInit() {}

  ngOnChanges(changes: SimpleChanges): void {
    //Called before any other lifecycle hook. Use it to inject dependencies, but avoid any serious work here.
    //Add '${implements OnChanges}' to the class.

    if (changes['wyLength']) {
      if (this.wyVertial) {
        this.style.height = this.wyLength + '%';
        this.style.left = null;
        this.style.width = null;
      } else {
        this.style.width = this.wyLength + '%';
        this.style.bottom = null;
        this.style.height = null;
      }
    }
  }
}
