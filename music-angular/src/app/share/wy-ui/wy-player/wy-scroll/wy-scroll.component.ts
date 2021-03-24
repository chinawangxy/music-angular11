import {
  Component,
  OnInit,
  ViewEncapsulation,
  ChangeDetectionStrategy,
  ViewChild,
  ElementRef,
  AfterViewInit,
  Input,
  OnChanges,
  SimpleChanges,
  Output,
  EventEmitter,
} from '@angular/core';

import BScroll from '@better-scroll/core';
import ScrollBar from '@better-scroll/scroll-bar';
import MouseWheel from '@better-scroll/mouse-wheel';

BScroll.use(ScrollBar).use(MouseWheel);

@Component({
  selector: 'app-wy-scroll',
  template: `
    <div class="wy-scroll" #wrap>
      <ng-content></ng-content>
    </div>
  `,
  styles: ['.wy-scroll { width: 100%; height: 100%; overflow: hidden; }'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WyScrollComponent implements OnInit, AfterViewInit, OnChanges {
  @Input() refreshDelay = 50;
  @Input() data: any[];
  @ViewChild('wrap', { static: true }) private wrapRef: ElementRef;
  @Output() private onScrollEnd = new EventEmitter<number>();

  private bs: BScroll;

  constructor(readonly el: ElementRef) {}

  ngOnInit() {}

  ngAfterViewInit(): void {
    this.bs = new BScroll(this.wrapRef.nativeElement, {
      scrollbar: {
        interactive: true,
      },
      mouseWheel: {},
    });
    // 设定监听事件 并将位置发送出去
    this.bs.on('scrollEnd', ({ y }) => this.onScrollEnd.emit(y));
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['data']) {
      this.refreshScroll();
    }
  }

  private refresh() {
    this.bs.refresh();
  }

  refreshScroll() {
    setTimeout(() => {
      this.refresh();
    }, this.refreshDelay);
  }

  scrollToElement(...args) {
    // 方法转嫁 到 bs的scrollToElement ,只保留参数
    this.bs.scrollToElement.apply(this.bs, args);
  }
}
