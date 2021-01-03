import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Banner } from './date-types/common.types';
import { ServicesModule, API_CONFIG } from './services.module';
import { map } from 'rxjs/internal/operators';

@Injectable({
  providedIn: ServicesModule,
})
export class HomeService {
  constructor(
    private http: HttpClient,
    @Inject(API_CONFIG) private baseUrl: string
  ) {}

  // 获取轮播图数据

  getBanners(): Observable<Banner[]> {
    return this.http
      .get(`${this.baseUrl}/banner`)
      .pipe(map((res: { banners: Banner[] }) => res.banners));
  }
}
