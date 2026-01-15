import { Music } from '../types';
import { API_CONFIG, buildApiUrl, rateLimiter, BitRate, MusicSource } from '../config/api.config';

/**
 * GD Studio Music API Utilities
 * 
 * This module provides functions to interact with the GD Studio's Online Music Platform API.
 * All functions use the new API endpoints and follow the rate limiting requirements.
 */

// Helper for making API requests with rate limiting
async function request(params: Record<string, any>): Promise<any> {
  // Check rate limit
  if (!rateLimiter.canMakeRequest()) {
    const remaining = rateLimiter.getRemainingRequests();
    throw new Error(`请求过于频繁，请稍后重试 (剩余请求数: ${remaining})`);
  }
  
  // Build URL
  const url = buildApiUrl(params);
  
  try {
    // Record request for rate limiting
    rateLimiter.recordRequest();
    
    // Make request with timeout
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000);
    
    const response = await fetch(url, { signal: controller.signal });
    clearTimeout(timeoutId);
    
    if (!response.ok) {
      if (response.status === 403) {
        throw new Error('请求过于频繁，请稍后重试');
      } else if (response.status === 404) {
        throw new Error('资源不存在');
      }
      throw new Error(`API request failed: ${response.status}`);
    }
    
    return response.json();
  } catch (error) {
    if (error instanceof Error) {
      if (error.name === 'AbortError') {
        throw new Error('请求超时，请检查网络连接');
      }
      throw error;
    }
    throw new Error('请求失败，请检查网络');
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
): Promise<any[]> => {
  const data = await request({
    types: API_CONFIG.endpoints.search,
    name: keyword,
    source,
    pages: page,
    count
  });
  
  // Return array of results
  return Array.isArray(data) ? data : [];
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
  const data = await request({
    types: API_CONFIG.endpoints.url,
    id: music.id,
    source: music.source,
    br: bitRate
  });
  
  return {
    url: data.url || '',
    br: data.br || bitRate,
    size: data.size || 0
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
  
  const data = await request({
    types: API_CONFIG.endpoints.pic,
    id: picId,
    source: music.source,
    size
  });
  
  return data.url || '';
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
  
  const data = await request({
    types: API_CONFIG.endpoints.lyric,
    id: lyricId,
    source: music.source
  });
  
  return {
    lyric: data.lyric || '',
    tlyric: data.tlyric || ''
  };
};

// Note: Playlist and userlist endpoints are not documented in the new API
// These functions are kept for backward compatibility but may not work

/**
 * Get playlist (may not be supported by new API)
 * @deprecated This endpoint may not be supported by the new API
 */
export const ajaxPlaylist = async (lid: string): Promise<any> => {
  console.warn('ajaxPlaylist may not be supported by the new GD Studio API');
  return request({
    types: 'playlist',
    id: lid,
  });
};

/**
 * Get user list (may not be supported by new API)
 * @deprecated This endpoint may not be supported by the new API
 */
export const ajaxUserList = async (uid: string): Promise<any> => {
  console.warn('ajaxUserList may not be supported by the new GD Studio API');
  return request({
    types: 'userlist',
    uid,
  });
};

/**
 * Get rate limiter status
 */
export const getRateLimiterStatus = () => {
  return {
    requestCount: rateLimiter.getRequestCount(),
    remainingRequests: rateLimiter.getRemainingRequests(),
    limit: API_CONFIG.requestLimit
  };
};
