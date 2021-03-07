import { DOCUMENT } from '@angular/common';
import {
  getCurrentIndex,
  getPlayMode,
  getCurrentSong,
} from './../../../store/selectors/playSelector';
import { SliderValue } from './../wy-slider/wy-slider-types';
import {
  Component,
  ElementRef,
  Inject,
  OnInit,
  ViewChild,
} from '@angular/core';
import { AppStoreModule } from 'src/app/store';
import { select, Store } from '@ngrx/store';
import { getPlayList, getSongList } from 'src/app/store/selectors/playSelector';
import { Song } from 'src/app/services/date-types';
import { SetCurrentIndex } from 'src/app/store/actions/player.actions';
import { fromEvent, Subscription } from 'rxjs';

@Component({
  selector: 'app-wy-player',
  templateUrl: './wy-player.component.html',
  styleUrls: ['./wy-player.component.less'],
})
export class WyPlayerComponent implements OnInit {
  // * 进度条
  percent: SliderValue = 0;
  // * 缓冲条
  bufferPercent: SliderValue = 0;

  songList: Song[];

  playList: Song[];

  currentIndex: number;

  currentSong: Song;

  picUrl: String | null;

  duration: number;

  currentTime: number;

  // 播放状态
  playing = false;

  // 是否可以播放
  songReady = false;

  // 音量
  volumn = 60;

  // 传入状态控制 - 当前点击部分是否是音量面板本身
  selfClick = false;
  private winClick: Subscription;

  // 是否展开音量面板
  showVolumnPanel = false;

  @ViewChild('audioEL', { static: true }) private audio: ElementRef;
  private audioEl: HTMLAudioElement;

  constructor(
    private store$: Store<AppStoreModule>,
    @Inject(DOCUMENT) private doc: Document
  ) {
    const appStore$ = this.store$.pipe(select('player'));

    const stateArr = [
      {
        type: getSongList,
        cb: (list) => this.watchList(list, 'songList'),
      },
      {
        type: getPlayList,
        cb: (list) => this.watchList(list, 'playList'),
      },
      {
        type: getCurrentIndex,
        cb: (list) => this.watchCurrentIndex(list),
      },
      {
        type: getPlayMode,
        cb: (mode) => this.watchPlayMode(mode),
      },
      {
        type: getCurrentSong,
        cb: (song) => this.watchCurrentSong(song),
      },
    ];

    stateArr.forEach((item) => {
      appStore$.pipe(select(item['type'])).subscribe(item.cb);
    });
  }

  ngOnInit() {
    this.audioEl = this.audio.nativeElement;
  }

  private watchList(list: Song[], type: string) {
    console.log('list', list);
    this[type] = list;
  }

  private watchCurrentIndex(index: number) {
    console.log('index', index);
    this.currentIndex = index;
  }

  private watchPlayMode(mode: number) {
    console.log('mode', mode);
    // this.currentIndex = Module;
  }

  private watchCurrentSong(song: Song) {
    console.log('song', song);
    if (!song) {
      return;
    }
    this.currentSong = song;
    this.duration = song.dt / 1000;

    // 设定播放歌曲图片

    this.picUrl = this.currentSong
      ? this.currentSong.al.picUrl
      : 'http://p3.music.126.net/6Jdgh303iLFmxbPUllu6wA==/109951163678416509.jpg';
  }

  public onCanPlay() {
    this.songReady = true;
    this.play();
  }

  private play() {
    // console.log('play');
    this.audioEl.play();
    this.playing = true;
  }

  // 播放 、 暂停
  onToggle() {
    if (!this.currentSong) {
      if (this.playList.length) {
        this.updateIndex(0);
      }
      return;
    }
    if (this.songReady) {
      this.playing = !this.playing;
      if (this.playing) {
        this.audioEl.play();
      } else {
        this.audioEl.pause();
      }
    }
  }

  private updateIndex(index: number) {
    this.store$.dispatch(SetCurrentIndex({ currentIndex: index }));
    this.songReady = false;
  }

  // 上一曲
  onPrev(index: number) {
    if (!this.songReady) {
      return;
    }
    if (this.playList.length === 1) {
      this.loop();
      return;
    }
    // 小于0时 播放最后一曲
    const newIndex = index < 0 ? this.playList.length - 1 : index;
    this.updateIndex(newIndex);
  }

  // 下一曲
  onNext(index: number) {
    if (!this.songReady) {
      return;
    }
    if (this.playList.length === 1) {
      this.loop();
      return;
    }
    const newIndex = index >= this.playList.length ? 0 : index;
    this.updateIndex(newIndex);
  }

  private loop() {
    this.audioEl.currentTime = 0;
    this.play();
  }

  onTimeUpdate(e: Event) {
    // console.log((e.target as HTMLAudioElement).currentTime);
    // console.log((<HTMLAudioElement>e.target).currentTime);
    this.currentTime = (<HTMLAudioElement>e.target).currentTime;
    // 播放进度
    this.percent = (this.currentTime / this.duration) * 100;

    // 缓冲条
    const buffered = this.audioEl.buffered;
    if (buffered.length && this.bufferPercent < 100) {
      this.bufferPercent = (buffered.end(0) / this.duration) * 100;
    }
  }
  // 控制播放进度
  onPrercentChange(per: number) {
    // console.log('per', per);
    if (this.currentSong) {
      this.audioEl.currentTime = this.duration * (per / 100);
    }
  }

  // 控制音量
  onVolumnChange(per: number) {
    this.audioEl.volume = per / 100;
  }

  // 控制音量面板
  toggleVolPanel(evt: MouseEvent) {
    // evt.stopPropagation();
    this.togglePanel();
  }

  togglePanel() {
    console.log('切换 音量');
    this.showVolumnPanel = !this.showVolumnPanel;

    if (this.showVolumnPanel) {
      this.bindDocumentClickListener();
    } else {
      this.unBindDocumentClickListener();
    }
  }

  private bindDocumentClickListener() {
    if (!this.winClick) {
      this.winClick = fromEvent(this.doc, 'click').subscribe(() => {
        if (!this.selfClick) {
          // 点击了播放器以外部分
          this.showVolumnPanel = false;
          this.unBindDocumentClickListener();
        }
        this.selfClick = false;
      });
    }
  }
  private unBindDocumentClickListener() {
    if (this.winClick) {
      this.winClick.unsubscribe();
      this.winClick = null;
    }
  }
}
