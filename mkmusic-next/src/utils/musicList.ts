// Music list configuration - migrated from original musicList.js
import { Playlist } from '../types/player';

export const initialMusicList: Playlist[] = [
  // System reserved playlists - do not modify
  {
    name: "搜索结果",
    cover: "",
    creatorName: "",
    creatorAvatar: "",
    item: []
  },
  {
    name: "正在播放",
    cover: "",
    creatorName: "",
    creatorAvatar: "",
    item: []
  },
  {
    name: "播放历史",
    cover: "images/history.png",
    creatorName: "",
    creatorAvatar: "",
    item: []
  },
  // Custom playlists start here
  {
    id: 3778678, // 云音乐热歌榜
    name: "云音乐热歌榜",
    cover: "",
    creatorName: "",
    creatorAvatar: "",
    item: []
  },
  {
    id: 3779629, // 云音乐新歌榜
    name: "云音乐新歌榜",
    cover: "",
    creatorName: "",
    creatorAvatar: "",
    item: []
  },
  {
    id: 4395559, // 华语金曲榜
    name: "华语金曲榜",
    cover: "",
    creatorName: "",
    creatorAvatar: "",
    item: []
  },
  {
    id: 64016, // 中国TOP排行榜（内地榜）
    name: "中国TOP排行榜（内地榜）",
    cover: "",
    creatorName: "",
    creatorAvatar: "",
    item: []
  },
  {
    id: 112504, // 中国TOP排行榜（港台榜）
    name: "中国TOP排行榜（港台榜）",
    cover: "",
    creatorName: "",
    creatorAvatar: "",
    item: []
  },
  {
    id: 19723756, // 云音乐飙升榜
    name: "云音乐飙升榜",
    cover: "",
    creatorName: "",
    creatorAvatar: "",
    item: []
  },
  {
    id: 2884035, // "网易原创歌曲榜"
    name: "网易原创歌曲榜",
    cover: "",
    creatorName: "",
    creatorAvatar: "",
    item: []
  },
  // Custom playlist example
  {
    name: "自定义列表",
    cover: "https://p3.music.126.net/34YW1QtKxJ_3YnX9ZzKhzw==/2946691234868155.jpg",
    creatorName: "",
    creatorAvatar: "",
    item: [
      {
        id: "436514312",
        name: "成都",
        artist: "赵雷",
        album: "成都",
        source: "netease",
        url_id: "436514312",
        pic_id: "2946691234868155",
        lyric_id: "436514312",
        pic: "https://p3.music.126.net/34YW1QtKxJ_3YnX9ZzKhzw==/2946691234868155.jpg",
        url: ""
      },
      {
        id: "65528",
        name: "淘汰",
        artist: "陈奕迅",
        album: "认了吧",
        source: "netease",
        url_id: "65528",
        pic_id: "18782957139233959",
        lyric_id: "65528",
        pic: "https://p3.music.126.net/BFuOepLmD63tY75UJs1c0Q==/18872017579169120.jpg",
        url: ""
      }
    ]
  },
  {
    id: 440103454, // 网易云歌单ID
    name: "网易云歌单",
    cover: "",
    creatorName: "",
    creatorAvatar: "",
    item: []
  }
];

// Format time for display (seconds to MM:SS)
export const formatTime = (seconds: number): string => {
  if (isNaN(seconds) || seconds < 0) return '00:00';

  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = Math.floor(seconds % 60);

  return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
};