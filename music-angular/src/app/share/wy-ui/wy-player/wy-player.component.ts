import { SliderValue } from './../wy-slider/wy-slider-types';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-wy-player',
  templateUrl: './wy-player.component.html',
  styleUrls: ['./wy-player.component.less'],
})
export class WyPlayerComponent implements OnInit {
  sliderValue: SliderValue = 35;
  constructor() {}

  ngOnInit() {}
}
