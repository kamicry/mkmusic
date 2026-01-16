export interface Music {
  id: string;
  name: string;
  artist: string;
  album: string;
  source: string;
  url_id: string;
  pic_id: string | null;
  lyric_id: string;
  pic: string | null;
  url: string | null;
  playedAt?: number;
}

export interface Playlist {
  id: string;
  name: string;
  cover: string;
  item: Music[];
  creatorName?: string;
}

export type OrderMode = 1 | 2 | 3;

export interface Config {
  api: string;
  loadcount: number;
}

export interface LyricLine {
  time: number;
  text: string;
}
