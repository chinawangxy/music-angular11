// 轮播图
export type Banner = {
  imageUrl: string;
  targetId: number;
  url: string;
};

// 热门分类
export type HotTag = {
  id: number;
  name: string;
  position: number;
};

// 歌单
export type SongSheet = {
  id: number;
  name: string;
  picUrl: string;
  playCount: number;
  tracks: Song[];
};

// 歌手
export type Singer = {
  id: number;
  name: string;
  picUrl: string;
  albumSize: number;
};

// 歌曲
export type Song = {
  id: number;
  name: string;
  url: string;
  ar: Singer[];
  al: { id: number; picUrl: string; name: string };
  dt: number;
};

export type SongUrl = {
  id: number;
  url: string;
};
