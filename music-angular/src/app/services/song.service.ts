import { HttpClient, HttpParams } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ServicesModule, API_CONFIG } from './services.module';
import { map } from 'rxjs/internal/operators';
import { Song, SongUrl } from './date-types';

@Injectable({
  providedIn: ServicesModule,
})
export class SongService {
  constructor(
    private http: HttpClient,
    @Inject(API_CONFIG) private baseUrl: string
  ) {}

  // 获取歌曲地址
  getSongUrl(ids: string): Observable<SongUrl[]> {
    const params = new HttpParams().set('id', ids);
    return this.http
      .get(`${this.baseUrl}/song/url`, { params })
      .pipe(map((res: { data: SongUrl[] }) => res.data));
  }

  // 整合歌单内歌曲数据 赋予URL
  getSongList(songs: Song | Song[]): Observable<Song[]> {
    const songArr = Array.isArray(songs) ? songs.slice() : [songs];
    const ids = songArr.map((item) => item.id).join(',');
    return this.getSongUrl(ids).pipe(
      map((urls) => this.generateSongList(songArr, urls))
    );
  }

  // 拼接歌单中歌曲 和 地址
  private generateSongList(songs: Song[], urls: SongUrl[]): Song[] {
    const result = [];
    songs.forEach((song) => {
      const url = urls.find((url) => url.id === song.id).url;
      if (url) {
        result.push({ ...song, url });
      }
    });

    return result;
  }
}
