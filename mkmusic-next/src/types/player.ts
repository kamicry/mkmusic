// Player types and interfaces

export interface MusicItem {
  id: string | null;
  name: string;
  artist: string;
  album: string;
  source: string;
  url_id: string | null;
  pic_id: string | null;
  lyric_id: string | null;
  pic: string | null;
  url: string | null;
}

export interface Playlist {
  id?: number | string;
  name: string;
  cover: string;
  creatorName?: string;
  creatorAvatar?: string;
  creatorID?: string;
  item: MusicItem[];
  isloading?: boolean;
}

export interface PlayerConfig {
  api: string;
  loadcount: number;
  method: string;
  defaultlist: number;
  autoplay: boolean;
  coverbg: boolean;
  mcoverbg: boolean;
  dotshine: boolean;
  mdotshine: boolean;
  volume: number;
  version: string;
  debug: boolean;
}