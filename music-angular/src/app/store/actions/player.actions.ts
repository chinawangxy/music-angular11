import { PlayMode } from './../../share/wy-ui/wy-player/player-type';
import { createAction, props } from '@ngrx/store';
import { Song } from 'src/app/services/date-types';

/**
 * ! 动作 行为
 * @param 第一个参数 语义化标识 描述当前行为做什么
 * @param 第二个参数
 *  */
export const SetPlaying = createAction(
  '[player] Set playing',
  props<{ playing: boolean }>()
);

export const SetPlayList = createAction(
  '[player] Set playList',
  props<{ playList: Song[] }>()
);

export const SetSongList = createAction(
  '[player] Set SongList',
  props<{ songList: Song[] }>()
);

export const SetPlayMode = createAction(
  '[player] Set SetPlayMode',
  props<{ playMode: PlayMode }>()
);

export const SetCurrentIndex = createAction(
  '[player] Set currentIndex',
  props<{ currentIndex: number }>()
);
