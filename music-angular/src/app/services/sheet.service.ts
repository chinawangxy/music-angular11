import { HttpClient, HttpParams } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ServicesModule, API_CONFIG } from './services.module';
import { map, pluck, switchMap } from 'rxjs/internal/operators';
import { Song, SongSheet } from './date-types';
import { SongService } from './song.service';

@Injectable({
  providedIn: ServicesModule,
})
export class SheetService {
  constructor(
    private http: HttpClient,
    private songService: SongService,
    @Inject(API_CONFIG) private baseUrl: string
  ) {}

  // 获取歌单详情
  getSongSheetDetail(id: number): Observable<SongSheet> {
    const params = new HttpParams().set('id', id.toString());
    return this.http
      .get(`${this.baseUrl}/playlist/detail`, { params })
      .pipe(map((res: { playlist: SongSheet }) => res.playlist));
  }

  // 返回歌单携带 URL
  playSheet(id: number): Observable<Song[]> {
    return this.getSongSheetDetail(id).pipe(
      pluck('tracks'),
      switchMap((tracks) => this.songService.getSongList(tracks))
    );
  }
}
