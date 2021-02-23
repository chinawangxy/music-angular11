import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnInit,
  Output,
  TemplateRef,
  ViewChild,
} from '@angular/core';

@Component({
  selector: 'app-wy-carousel',
  templateUrl: './wy-carousel.component.html',
  styleUrls: ['./wy-carousel.component.less'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WyCarouselComponent implements OnInit {
  @ViewChild('dot', { static: true })
  dotRef: TemplateRef<ElementRef>;

  @Input() activeIndex: number = 0;

  @Output() changeSlide = new EventEmitter<'pre' | 'next'>();
  constructor() {}

  ngOnInit() {}

  onChangeSlide(type: 'pre' | 'next') {
    console.log('[主动点击切换轮播图 =>]', type);
    this.changeSlide.emit(type);
  }
}
