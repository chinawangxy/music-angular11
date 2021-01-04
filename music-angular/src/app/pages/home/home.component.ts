import { Component, OnInit, ViewChild } from '@angular/core';
import { Banner, HotTag, Singer, SongSheet } from 'src/app/services/date-types';
import { HomeService } from './../../services/home.service';
import { NzCarouselComponent } from 'ng-zorro-antd';
import { map } from 'rxjs/internal/operators';
import { SingerService } from 'src/app/services/singer.service';

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

  @ViewChild(NzCarouselComponent, { static: true })
  private nzCarousel: NzCarouselComponent;

  constructor(
    private homeService: HomeService,
    private singerService: SingerService
  ) {}

  ngOnInit() {
    this.getBanners();
    this.getHotTags();
    this.getPersonalizedSheetList();
    this.getEnterSingers();
  }

  onBeforeChange({ to }) {
    console.log('[onBeforeChange =>]', to);
    this.carouselActiveIndex = to;
  }

  onChangeSlide(type: 'pre' | 'next') {
    this.nzCarousel[type]();
  }

  private getBanners() {
    this.homeService.getBanners().subscribe((banners) => {
      console.log('[这是轮播图数据]', banners);
      this.banners = banners;
    });
  }

  private getHotTags() {
    this.homeService
      .getHotTags()
      .pipe(
        map((tags) => {
          return tags
            .sort((x: HotTag, y: HotTag) => x.position - y.position)
            .slice(0, 5);
        })
      )
      .subscribe((tags) => {
        console.log('[这是热门数据]', tags);
        this.hotTags = tags;
      });
  }
  private getPersonalizedSheetList() {
    this.homeService
      .getPersonalSheetList()
      .pipe(map((sheets) => sheets.splice(0, 12)))
      .subscribe((sheets) => {
        console.log('[这是个人歌单数据]', sheets);
        this.songSheetList = sheets;
      });
  }

  private getEnterSingers() {
    this.singerService.getEnterSinger().subscribe((singers) => {
      console.log('[入住歌手数据]', singers);
      this.singers = singers;
    });
  }
}
