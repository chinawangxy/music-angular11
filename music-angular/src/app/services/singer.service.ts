import { HttpClient, HttpParams } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Singer } from './date-types/common.types';
import { ServicesModule, API_CONFIG } from './services.module';
import { map } from 'rxjs/internal/operators';
import queryString from 'query-string';

type SingerParams = {
  offset: number;
  limit: number;
  cat?: string;
};

const defaultParams: SingerParams = {
  offset: 0,
  limit: 9,
  cat: '5001',
};

@Injectable({
  providedIn: ServicesModule,
})
export class SingerService {
  constructor(
    private http: HttpClient,
    @Inject(API_CONFIG) private baseUrl: string
  ) {}

  // 获取轮播图数据

  getEnterSinger(args: SingerParams = defaultParams): Observable<Singer[]> {
    const params = new HttpParams({ fromString: queryString.stringify(args) });
    return this.http
      .get(`${this.baseUrl}/artist/list`, { params })
      .pipe(map((res: { artists: Singer[] }) => res.artists));
  }
}
