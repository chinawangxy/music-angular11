import { Component, OnInit, ViewChild } from '@angular/core';
import { Banner, HotTag, SongSheet } from 'src/app/services/date-types';
import { HomeService } from './../../services/home.service';
import { NzCarouselComponent } from 'ng-zorro-antd';
import { map } from 'rxjs/internal/operators';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.less'],
})
export class HomeComponent implements OnInit {
  public banners: Banner[];
  public hotTags: HotTag[];
  public songSheetList: SongSheet[];

  public carouselActiveIndex = 0;

  @ViewChild(NzCarouselComponent, { static: true })
  private nzCarousel: NzCarouselComponent;

  constructor(private homeService: HomeService) {}

  ngOnInit() {
    this.getBanners();
    this.getHotTags();
    this.getPersonalizedSheetList();
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
      .pipe(map((tags) => tags.slice(0, 5)))
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
}
