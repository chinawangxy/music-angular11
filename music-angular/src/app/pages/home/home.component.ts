import { PlayState } from './../../store/reducers/player.reducer';
import {
  SetCurrentIndex,
  SetPlayList,
  SetSongList,
} from './../../store/actions/player.actions';
import { SheetService } from './../../services/sheet.service';
import { Component, OnInit, ViewChild } from '@angular/core';
import { Banner, HotTag, Singer, SongSheet } from 'src/app/services/date-types';
import { NzCarouselComponent } from 'ng-zorro-antd';
import { ActivatedRoute } from '@angular/router';
import { AppStoreModule } from 'src/app/store';
import { select, Store } from '@ngrx/store';
import { getPlayer } from 'src/app/store/selectors/playSelector';
import { findIndex, shuffle } from 'src/app/utils/array';
@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.less'],
})
export class HomeComponent implements OnInit {
  public banners: Banner[];
  public hotTags: HotTag[];
  public songSheetList: SongSheet[];
  public singers: Singer[];

  public carouselActiveIndex = 0;
  private playerState: PlayState;

  @ViewChild(NzCarouselComponent, { static: true })
  private nzCarousel: NzCarouselComponent;

  constructor(
    private sheetService: SheetService,
    private route: ActivatedRoute,
    private store$: Store<AppStoreModule>
  ) {
    this.store$.pipe(select(getPlayer)).subscribe((res) => {
      this.playerState = res;
    });
  }

  ngOnInit() {
    this.route.data.subscribe(
      ({ homeDatas: [banners, hotTags, songSheet, singers] }) => {
        this.banners = banners;
        this.hotTags = hotTags;
        this.songSheetList = songSheet;
        this.singers = singers;
      }
    );
  }

  onBeforeChange({ to }) {
    // console.log('[onBeforeChange =>]', to);
    this.carouselActiveIndex = to;
  }

  onChangeSlide(type: 'pre' | 'next') {
    this.nzCarousel[type]();
  }

  /**
   * 播放歌单
   * @param id 歌单Id
   */
  onPlaySheet(id: number) {
    // console.log('[歌单的id]', id);
    this.sheetService.playSheet(id).subscribe((list) => {
      // console.log('[歌单数据：]', list);

      this.store$.dispatch(SetSongList({ songList: list }));
      console.log('list', list);
      let tureIndex = 0;
      let tureList = list.slice();
      // !考虑模式随机 场景下首次播放
      if (this.playerState.playMode.type === 'random') {
        console.log('random');

        tureList = shuffle(tureList || []);
        tureIndex = findIndex(tureList, list[tureIndex]);

        console.log('random', tureList, tureIndex);
      }

      this.store$.dispatch(SetPlayList({ playList: tureList }));
      this.store$.dispatch(SetCurrentIndex({ currentIndex: tureIndex }));
    });
  }
}
