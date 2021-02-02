import { DOCUMENT } from '@angular/common';
import {
  ChangeDetectorRef,
  Component,
  ElementRef,
  Inject,
  Input,
  OnDestroy,
  OnInit,
  ViewChild,
  ViewEncapsulation,
} from '@angular/core';
import { fromEvent, merge, Observable, Subscription } from 'rxjs';
import {
  distinctUntilChanged,
  filter,
  map,
  pluck,
  takeUntil,
  tap,
} from 'rxjs/internal/operators';
import {
  getElementOffset,
  getPercent,
  inArray,
  limitNumberInRange,
  sliderEvent,
} from './wy-slider-helper';
import { SliderEventObserverConfig, SliderValue } from './wy-slider-types';

@Component({
  selector: 'app-wy-slider',
  templateUrl: './wy-slider.component.html',
  styleUrls: ['./wy-slider.component.less'],
  encapsulation: ViewEncapsulation.None,
})
export class WySliderComponent implements OnInit, OnDestroy {
  @Input() wyVertical = false;
  @Input() wyMin = 0;
  @Input() wyMax = 100;
  @ViewChild('wySlider', { static: true }) private wySlider: ElementRef;

  private sliderDom: HTMLDivElement;

  private isDragging: boolean = false;

  value: SliderValue = null;
  offset: SliderValue = null;
  // ! 绑定订阅流
  private dragStart$: Observable<number>;
  private dragMove$: Observable<number>;
  private dragEnd$: Observable<Event>;
  // ! 取消订阅流
  private dragStart$_: Subscription | null;
  private dragMove$_: Subscription | null;
  private dragEnd$_: Subscription | null;

  constructor(
    private el: ElementRef,
    @Inject(DOCUMENT) private doc: Document,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    console.log('el:', this.wySlider.nativeElement);
    this.sliderDom = this.wySlider.nativeElement;
    this.createDraggingObservables();
    this.subscribeDrag(['start']);
  }

  private createDraggingObservables() {
    const orientField = this.wyVertical ? 'pageY' : 'pageX';
    const mouse: SliderEventObserverConfig = {
      start: 'mousedown',
      move: 'mousemove',
      end: 'mouseend',
      filter: (e) => e instanceof MouseEvent,
      pluckKey: [orientField],
    };
    const touch: SliderEventObserverConfig = {
      start: 'touchdown',
      move: 'touchmove',
      end: 'touchend',
      filter: (e) => e instanceof TouchEvent,
      pluckKey: ['touches', '0', orientField],
    };

    // 创建 数据源
    [mouse, touch].forEach((source) => {
      const { start, move, end, filter: filterFun, pluckKey } = source;
      // 移动开始移动 起点
      source.startPlucked$ = fromEvent(this.sliderDom, start).pipe(
        filter(filterFun),
        tap(sliderEvent),
        pluck(...pluckKey),
        map((position: number) => this.findClosesetValue(position))
      );

      // 移动结束 终点
      source.end$ = fromEvent(this.doc, end);

      // 移动 过程
      source.moveResolved$ = fromEvent(this.doc, move).pipe(
        filter(filterFun),
        tap(sliderEvent),
        pluck(...pluckKey),
        distinctUntilChanged(),
        map((position: number) => this.findClosesetValue(position)),
        takeUntil(source.end$)
      );
    });

    this.dragStart$ = merge(mouse.startPlucked$, touch.startPlucked$);
    this.dragMove$ = merge(mouse.moveResolved$, touch.moveResolved$);
    this.dragEnd$ = merge(mouse.end$, touch.end$);
  }

  /**
   * @summary 订阅事件
   */
  private subscribeDrag(events: string[] = ['move', 'start', 'end']) {
    if (inArray(events, 'start') && this.dragStart$ && !this.dragStart$_) {
      this.dragStart$.subscribe(this.onDragStart.bind(this));
    }
    if (inArray(events, 'move') && this.dragMove$ && !this.dragMove$_) {
      this.dragMove$.subscribe(this.onDragMove.bind(this));
    }
    if (inArray(events, 'end') && this.dragEnd$ && this.dragEnd$_) {
      this.dragEnd$.subscribe(this.onDragEnd.bind(this));
    }
  }

  /**
   * @summary 解除订阅事件
   */
  private unSubscribeDrag(events: string[] = ['move', 'start', 'end']) {
    if (inArray(events, 'start') && this.dragStart$_) {
      this.dragStart$_.unsubscribe();
      this.dragStart$_ = null;
    }
    if (inArray(events, 'move') && this.dragMove$_) {
      this.dragMove$_.unsubscribe();
      this.dragMove$_ = null;
    }
    if (inArray(events, 'end') && this.dragEnd$_) {
      this.dragEnd$_.unsubscribe();
      this.dragEnd$_ = null;
    }
  }

  private onDragStart(value: number) {
    // * 正在移动 时传入参数 true
    this.toggleDragMove(true);
    // * 设定值
    this.setValue(value);
  }

  private onDragMove(value: number) {
    if (this.isDragging) {
      // * 设定值
      this.setValue(value);
      // ! 手动触发变更检查
      this.cdr.markForCheck();
    }
  }

  private onDragEnd() {
    // ! 不移动时 传入参数 false
    this.toggleDragMove(false);
    // ! 手动触发变更检查
    this.cdr.markForCheck();
  }

  private toggleDragMove(movable: boolean) {
    this.isDragging = movable;
    if (movable) {
      this.subscribeDrag(['move', 'end']);
    } else {
      // this.unSubscribeDrag()
    }
  }

  // * 设定值
  private setValue(value: SliderValue) {
    // * 优化
    if (this.valueEqual(this.value, value)) {
      this.value = value;
      // * 更新DOM
      this.updateTrackAndHandles();
    }
  }

  private valueEqual(valA: SliderValue, valB: SliderValue): boolean {
    if (typeof valA !== typeof valB) {
      return false;
    }
    return valA === valB;
  }

  private updateTrackAndHandles() {
    this.offset = this.getValueToOffset(this.value);
    // ! 手动触发变更检查
    this.cdr.markForCheck();
  }

  private getValueToOffset(value: SliderValue): SliderValue {
    return getPercent(value, this.wyMin, this.wyMax);
  }

  /**
   * 工具 转换位置数据
   */
  private findClosesetValue(position: number): number {
    // return position;
    // 获取滑块总长
    const sliderLength = this.getSliderLength();
    // 滑块(上，左)端点的位置
    const sliderStart = this.getSliderStartPosition();
    // 滑块当前位置 / 滑块总长
    const ratio = limitNumberInRange(
      (position - sliderStart) / sliderLength,
      0,
      1
    );

    const ratioTrue = this.wyVertical ? 1 - ratio : ratio;

    return ratioTrue * (this.wyMax - this.wyMin) + this.wyMin;
  }

  private getSliderLength(): number {
    return this.wyVertical
      ? this.sliderDom.clientHeight
      : this.sliderDom.clientWidth;
  }
  private getSliderStartPosition(): number {
    const offset = getElementOffset(this.sliderDom);
    return this.wyVertical ? offset.top : offset.left;
  }

  ngOnDestroy(): void {
    this.unSubscribeDrag();
  }
}
