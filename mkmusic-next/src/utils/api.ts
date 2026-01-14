import { Music, Playlist } from '../types';

const API_URL = 'api.php'; // In a real Next.js app, this might be an absolute URL or proxied

// Helper for JSONP-like requests if necessary, but here we'll try to use fetch
// If the API supports JSON, fetch is better. If it only supports JSONP, we might need a workaround.
// However, the instructions say "使用 fetch/axios 替代 jQuery.ajax".

async function request(params: Record<string, any>) {
  const query = new URLSearchParams(params).toString();
  // We'll use a relative URL, assuming it's served from the same domain or proxied
  const response = await fetch(`${API_URL}?${query}`);
  if (!response.ok) {
    throw new Error(`API request failed: ${response.status}`);
  }
  return response.json();
}

// Since the original used JSONP, if we use fetch directly it might fail if CORS is not set.
// But the instructions say to use fetch/axios.

export const ajaxSearch = async (wd: string, source: string, page: number, count: number) => {
  return request({
    types: 'search',
    count,
    source,
    pages: page,
    name: wd,
  });
};

export const ajaxUrl = async (music: Music) => {
  const data = await request({
    types: 'url',
    id: music.id,
    source: music.source,
  });
  return data.url;
};

export const ajaxPic = async (music: Music) => {
  const data = await request({
    types: 'pic',
    id: music.pic_id,
    source: music.source,
  });
  return data.url;
};

export const ajaxLyric = async (music: Music) => {
  const data = await request({
    types: 'lyric',
    id: music.lyric_id,
    source: music.source,
  });
  return data.lyric || '';
};

export const ajaxPlaylist = async (lid: string) => {
  return request({
    types: 'playlist',
    id: lid,
  });
};

export const ajaxUserList = async (uid: string) => {
  return request({
    types: 'userlist',
    uid,
  });
};
