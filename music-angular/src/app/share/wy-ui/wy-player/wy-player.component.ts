import {
  SetPlayList,
  SetPlayMode,
} from './../../../store/actions/player.actions';
import { PlayMode } from 'src/app/share/wy-ui/wy-player/player-type';
import { DOCUMENT } from '@angular/common';
import {
  getCurrentIndex,
  getPlayMode,
  getCurrentSong,
  getPlayer,
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
import { tap } from 'rxjs/internal/operators';
import { findIndex, shuffle } from 'src/app/utils/array';

const modeTypes: PlayMode[] = [
  {
    type: 'loop',
    label: '循环',
  },
  {
    type: 'random',
    label: '随机',
  },
  {
    type: 'singleLoop',
    label: '单曲循环',
  },
];

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

  currentMode: PlayMode;

  modeCount = 0;

  // 歌单面板
  showPanel = false;

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
    const appStore$ = this.store$.pipe(select(getPlayer));
    appStore$
      .pipe(select(getSongList))
      .subscribe((list) => this.watchList(list, 'songList'));
    appStore$
      .pipe(select(getPlayList))
      .subscribe((list) => this.watchList(list, 'playList'));
    appStore$
      .pipe(select(getCurrentIndex))
      .subscribe((index) => this.watchCurrentIndex(index));
    appStore$
      .pipe(select(getPlayMode))
      .subscribe((mode) => this.watchPlayMode(mode));
    appStore$
      .pipe(select(getCurrentSong))
      .subscribe((song) => this.watchCurrentSong(song));
    // appStore$.pipe(select(getCurrentAction)).subscribe(action => this.watchCurrentAction(action));
  }

  ngOnInit() {
    this.audioEl = this.audio.nativeElement;
  }

  private watchList(list: Song[], type: string) {
    this[type] = list;
  }

  private watchCurrentIndex(index: number) {
    // console.log('index:', index);
    this.currentIndex = index;
  }

  private watchPlayMode(mode: PlayMode) {
    // console.log('mode', mode);
    this.currentMode = mode;
    // 保存副本 避免引用问题
    if (this.songList) {
      let list = this.songList.slice();
      if (mode.type === 'random') {
        list = shuffle(this.songList);
        // 随机模式下 才更换 当前歌曲索引
        this.updateCurrentIndex(list, this.currentSong);
        this.store$.dispatch(SetPlayList({ playList: list }));
      }
    }
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

      // 根据 播放状态 操作DOM
      if (this.playing) {
        this.audioEl.play();
      } else {
        this.audioEl.pause();
      }
    }
  }

  // 设置歌曲播放
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

  // 循环播放
  private loop() {
    this.audioEl.currentTime = 0;
    this.play();
  }
  // 播放时间变更时 更新 缓冲条 与 播放进度
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
  toggleVolPanel() {
    this.togglePanel('showVolumnPanel');
  }
  // 控制歌曲面板
  toggleListPanel() {
    if (this.songList.length) {
      this.togglePanel('showPanel');
    }
  }
  // 切换音量面板  + //!主动设置监听和接触监听
  togglePanel(type: string) {
    // console.log('切换 音量');
    this[type] = !this[type];

    if (this.showVolumnPanel || this.showPanel) {
      // 面板 开启 绑定监听
      this.bindDocumentClickListener();
    } else {
      // 面板关闭 解除监听
      this.unBindDocumentClickListener();
    }
  }

  // 改变当前播放歌曲
  onChangeSong(song: Song) {
    console.log('song', song);
    // 随机模式下 才更换 当前歌曲索引
    this.updateCurrentIndex(this.playList, song);
  }

  private bindDocumentClickListener() {
    // 监听事件 不存在 则设立监听事件
    if (!this.winClick) {
      // !被动监听事件 关闭面板 取消监听
      this.winClick = fromEvent(this.doc, 'click').subscribe(() => {
        // 非播放器 点击 则解绑
        if (!this.selfClick) {
          // 点击了播放器以外部分
          this.showVolumnPanel = false; // 关闭面板
          this.showPanel = false; // 关闭面板
          this.unBindDocumentClickListener(); // 解绑监听事件 初始化
        }
        // 设置状态
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

  // 改变模式
  changeMode() {
    const temp = modeTypes[++this.modeCount % 3];
    // console.log(temp);

    // 变更mode
    this.store$.dispatch(
      SetPlayMode({ playMode: modeTypes[++this.modeCount % 3] })
    );
  }

  private updateCurrentIndex(list: Song[], song: Song) {
    // const newIndex = list.findIndex((item) => item.id === song.id);
    const newIndex = findIndex(list, song);
    this.store$.dispatch(SetCurrentIndex({ currentIndex: newIndex }));
  }

  // 播放结束
  onEnded() {
    this.playing = false;
    if (this.currentMode.type === 'singleLoop') {
      this.loop();
    } else {
      this.onNext(this.currentIndex + 1);
    }
  }
}
