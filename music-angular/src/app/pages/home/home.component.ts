import { Component, OnInit, ViewChild } from '@angular/core';
import { Banner } from 'src/app/services/date-types';
import { HomeService } from './../../services/home.service';
import { NzCarouselComponent } from 'ng-zorro-antd';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.less'],
})
export class HomeComponent implements OnInit {
  public banners: Banner[];

  public carouselActiveIndex = 0;

  @ViewChild(NzCarouselComponent, { static: true })
  private nzCarousel: NzCarouselComponent;

  constructor(private homeService: HomeService) {}

  ngOnInit() {
    this.homeService.getBanners().subscribe((banners) => {
      console.log('[这是轮播图数据]', banners);
      this.banners = banners;
    });
  }

  onBeforeChange({ to }) {
    console.log('[onBeforeChange =>]', to);
    this.carouselActiveIndex = to;
  }

  onChangeSlide(type: 'pre' | 'next') {
    this.nzCarousel[type]();
  }
}
