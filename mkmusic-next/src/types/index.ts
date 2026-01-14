export interface Music {
  id: string;
  name: string;
  artist: string;
  album: string;
  source: string;
  url_id: string;
  pic_id: string;
  lyric_id: string;
  pic: string | null;
  url: string | null;
}

export interface Playlist {
  id?: string;
  name: string;
  cover: string;
  item: Music[];
  isloading?: boolean;
  creatorID?: string;
}

export type OrderMode = 1 | 2 | 3; // 1: 单曲循环, 2: 列表循环, 3: 随机播放
