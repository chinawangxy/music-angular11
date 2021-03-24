import { Song } from '../services/date-types';
import { getRandomInt } from './number';

export function shuffle<T>(arr: T[]): T[] {
  const result = arr.slice();
  for (let i = 0; i < result.length; i++) {
    // 取0 和 i 之间的随机数
    const j = getRandomInt([0, i]);
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

export function findIndex(list: Song[], currentSong: Song): number {
  return list.findIndex((item) => item.id === currentSong.id);
}
