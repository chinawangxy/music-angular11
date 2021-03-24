import { WyScrollComponent } from './../wy-scroll/wy-scroll.component';
import {
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  QueryList,
  SimpleChanges,
  ViewChildren,
} from '@angular/core';
import { Song } from 'src/app/services/date-types';
import { findIndex } from 'src/app/utils/array';

@Component({
  selector: 'app-wy-player-panel',
  templateUrl: './wy-player-panel.component.html',
  styleUrls: ['./wy-player-panel.component.less'],
})
export class WyPlayerPanelComponent implements OnInit, OnChanges {
  @Input() songList: Song[];
  @Input() currentSong: Song;
  @Input() show: Boolean;

  @Output() onClose = new EventEmitter<void>();
  @Output() onChangeSong = new EventEmitter<Song>();

  scrollY: number = 0;
  currentIndex: number;

  @ViewChildren(WyScrollComponent)
  private wyScroll: QueryList<WyScrollComponent>;

  constructor() {}

  ngOnInit() {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['songList']) {
      this.currentIndex = 0;
    }

    if (changes['currentSong']) {
      // !监听 当前播放歌曲
      if (this.currentSong) {
        // 计算当前歌曲 索引
        // this.currentIndex = findIndex(this.songList, this.currentSong);
        this.currentIndex = findIndex(this.songList, this.currentSong);

        if (this.show) {
          // 调整滚动条 展示歌曲
          this.scrollToCurrent();
        }
      }
    }

    if (changes['show']) {
      if (!changes['show'].firstChange && this.show) {
        this.wyScroll.first.refreshScroll();
        // !由于需要刷新dom 延时50 则滚动需要大于延时时间后滚动
        setTimeout(() => {
          if (this.currentSong) {
            this.scrollToCurrent(0);
          }
        }, 80);
      }
    }
  }

  onCLoseData() {
    this.onClose.emit();
  }

  private scrollToCurrent(speed = 300) {
    // 获取元素
    const songlistRefs = this.wyScroll.first.el.nativeElement.querySelectorAll(
      'ul li'
    );
    // 找到播放歌曲dom
    if (songlistRefs.length) {
      const currentLi = <HTMLElement>songlistRefs[this.currentIndex || 0];
      const offsetTop = currentLi.offsetTop;
      const offsetHeight = currentLi.offsetHeight;

      if (
        offsetTop - Math.abs(this.scrollY) > offsetHeight * 5 ||
        offsetTop < Math.abs(this.scrollY)
      ) {
        this.wyScroll.first.scrollToElement(currentLi, speed, false, false);
      }
    }
  }
}
