import {
  getCurrentIndex,
  getPlayMode,
  getCurrentSong,
} from './../../../store/selectors/playSelector';
import { SliderValue } from './../wy-slider/wy-slider-types';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { AppStoreModule } from 'src/app/store';
import { select, Store } from '@ngrx/store';
import { getPlayList, getSongList } from 'src/app/store/selectors/playSelector';
import { Song } from 'src/app/services/date-types';

@Component({
  selector: 'app-wy-player',
  templateUrl: './wy-player.component.html',
  styleUrls: ['./wy-player.component.less'],
})
export class WyPlayerComponent implements OnInit {
  // * 进度条
  sliderValue: SliderValue = 35;
  // * 缓冲条
  bufferOffest: SliderValue = 70;

  songList: Song[];

  playList: Song[];

  currentIndex: number;

  currentSong: Song;

  picUrl: String | null;

  duration: number;

  currentTime: number;

  @ViewChild('audioEL', { static: true }) private audio: ElementRef;
  private audioEl: HTMLAudioElement;

  constructor(private store$: Store<AppStoreModule>) {
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
    this.play();
  }

  private play() {
    // console.log('play');
    this.audioEl.play();
  }

  onTimeUpdate(e: Event) {
    // console.log((e.target as HTMLAudioElement).currentTime);
    // console.log((<HTMLAudioElement>e.target).currentTime);
    this.currentTime = (<HTMLAudioElement>e.target).currentTime;
  }
}
