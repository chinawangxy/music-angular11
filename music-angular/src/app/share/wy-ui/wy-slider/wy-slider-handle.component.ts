import { ChangeDetectionStrategy } from '@angular/core';
import {
  Component,
  Input,
  OnChanges,
  OnInit,
  SimpleChanges,
} from '@angular/core';
import { WySliderStyle } from './wy-slider-types';

@Component({
  selector: 'app-wy-slider-handle',
  template: '<div class="wy-slider-handle" [ngStyle]="style"></div>',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WySliderHandleComponent implements OnInit, OnChanges {
  @Input() wyVertial = false;
  @Input() wyOffset: number;
  // 滑块的样式
  style: WySliderStyle = {};
  constructor() {}

  ngOnInit() {}

  ngOnChanges(changes: SimpleChanges): void {
    //Called before any other lifecycle hook. Use it to inject dependencies, but avoid any serious work here.
    //Add '${implements OnChanges}' to the class.

    if (changes['wyOffset']) {
      this.style[this.wyVertial ? 'bottom' : 'left'] = this.wyOffset + '%';
    }
  }
}
