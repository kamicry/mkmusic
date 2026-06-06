import { Music } from '../types';
import { API_CONFIG, buildApiUrl, BitRate, MusicSource } from '../config/api.config';

/**
 * GD Studio Music API Utilities
 * 
 * This module provides functions to interact with the GD Studio's Online Music Platform API.
 * All functions use the new API endpoints.
 */

const inFlightRequests = new Map<string, Promise<unknown>>();

type ApiObject = Record<string, unknown>;

const asApiObject = (data: unknown): ApiObject => (
  data && typeof data === 'object' ? data as ApiObject : {}
);

export interface ApiSearchResult {
  id: string;
  name: string;
  artist: string | string[];
  album: string;
  source: string;
  url_id?: string;
  pic_id?: string;
  lyric_id?: string;
}

// Helper for making API requests with rate limiting
async function request(params: Record<string, string | number>): Promise<unknown> {
  const url = buildApiUrl(params);

  const pendingRequest = inFlightRequests.get(url);
  if (pendingRequest) {
    return pendingRequest;
  }

  const requestPromise = (async () => {
    const hasAbortController = typeof AbortController !== 'undefined';
    const controller = hasAbortController ? new AbortController() : null;
    const timeoutId = controller ? setTimeout(() => controller.abort(), 10000) : null;

    try {
      const response = await fetch(url, controller ? { signal: controller.signal } : undefined);

      if (!response.ok) {
        if (response.status === 403) {
          throw new Error('请求过于频繁，请稍后重试');
        } else if (response.status === 404) {
          throw new Error('资源不存在');
        }
        throw new Error(`API request failed: ${response.status}`);
      }

      return response.json();
    } finally {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    }
  })();

  inFlightRequests.set(url, requestPromise);

  try {
    return await requestPromise;
  } catch (error) {
    if (error instanceof Error) {
      if (error.name === 'AbortError') {
        throw new Error('请求超时，请检查网络连接');
      }
      throw error;
    }
    throw new Error('请求失败，请检查网络');
  } finally {
    inFlightRequests.delete(url);
  }
}

/**
 * Search for music
 * @param keyword - Search keyword (song name, artist, album)
 * @param source - Music source (netease, kuwo, joox)
 * @param page - Page number (starts from 1)
 * @param count - Number of results per page (default: 20)
 * @returns Array of music items
 */
export const ajaxSearch = async (
  keyword: string,
  source: MusicSource = 'netease',
  page: number = 1,
  count: number = API_CONFIG.pageSize
): Promise<ApiSearchResult[]> => {
  const data = await request({
    types: API_CONFIG.endpoints.search,
    name: keyword,
    source,
    pages: page,
    count
  });
  
  // Return array of results
  return Array.isArray(data) ? data as ApiSearchResult[] : [];
};

/**
 * Get music URL with specified bit rate
 * @param music - Music object
 * @param bitRate - Bit rate (128, 192, 320, 740, 999)
 * @returns Object with url, actual bit rate, and file size
 */
export const ajaxUrl = async (
  music: Music,
  bitRate: BitRate = API_CONFIG.defaultBitRate
): Promise<{ url: string; br: number; size: number }> => {
  const data = asApiObject(await request({
    types: API_CONFIG.endpoints.url,
    id: music.url_id || music.id,
    source: music.source,
    br: bitRate
  }));
  
  return {
    url: typeof data.url === 'string' ? data.url : '',
    br: typeof data.br === 'number' ? data.br : bitRate,
    size: typeof data.size === 'number' ? data.size : 0
  };
};

/**
 * Get album cover image URL
 * @param music - Music object
 * @param size - Image size (90, 300, 500)
 * @returns Image URL
 */
export const ajaxPic = async (
  music: Music,
  size: number = API_CONFIG.imageSizes.large
): Promise<string> => {
  // Use pic_id if available, otherwise use music id
  const picId = music.pic_id || music.id;
  
  const data = asApiObject(await request({
    types: API_CONFIG.endpoints.pic,
    id: picId,
    source: music.source,
    size
  }));
  
  return typeof data.url === 'string' ? data.url : '';
};

/**
 * Get song lyrics
 * @param music - Music object
 * @returns Object with original lyrics and translated lyrics
 */
export const ajaxLyric = async (
  music: Music
): Promise<{ lyric: string; tlyric?: string }> => {
  // Use lyric_id if available, otherwise use music id
  const lyricId = music.lyric_id || music.id;
  
  const data = asApiObject(await request({
    types: API_CONFIG.endpoints.lyric,
    id: lyricId,
    source: music.source
  }));
  
  return {
    lyric: typeof data.lyric === 'string' ? data.lyric : '',
    tlyric: typeof data.tlyric === 'string' ? data.tlyric : ''
  };
};

// Note: Playlist and userlist endpoints are not documented in the new API
// These functions are kept for backward compatibility but may not work

/**
 * Get playlist (may not be supported by new API)
 * @deprecated This endpoint may not be supported by the new API
 */
export const ajaxPlaylist = async <T = unknown>(lid: string): Promise<T> => {
  console.warn('ajaxPlaylist may not be supported by the new GD Studio API');
  return request({
    types: 'playlist',
    id: lid,
  }) as Promise<T>;
};

/**
 * Get user list (may not be supported by new API)
 * @deprecated This endpoint may not be supported by the new API
 */
export const ajaxUserList = async <T = unknown>(uid: string): Promise<T> => {
  console.warn('ajaxUserList may not be supported by the new GD Studio API');
  return request({
    types: 'userlist',
    uid,
  }) as Promise<T>;
};
