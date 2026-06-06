/**
 * GD Studio's Online Music Platform API Configuration
 * 
 * API Documentation: https://music-api.gdstudio.xyz/api.php
 * Stable Music Sources: netease, kuwo, joox
 * Original API by metowolf & mengkun
 * Modified by GD Studio
 * 
 * Note: This API is for learning purposes only, not for commercial use.
 * Please credit "GD音乐台(music.gdstudio.xyz)" when using this API.
 */

export const API_CONFIG = {
  // Base URL for the music API
  baseUrl: 'https://music-api.gdstudio.xyz/api.php',

  // GD Music web endpoint used for playlist/ranking data
  playlistBaseUrl: 'https://music.gdstudio.org/api.php',
  
  // Only stable music sources are supported
  sources: ['netease', 'kuwo', 'joox'] as const,
  
  // Source display names
  sourceLabels: {
    netease: '网易云',
    kuwo: '酷我',
    joox: 'JOOX'
  } as const,
  
  // Supported bit rates (kbps)
  bitRates: [128, 192, 320, 740, 999] as const,
  
  // Bit rate display labels
  bitRateLabels: {
    128: '128kbps',
    192: '192kbps',
    320: '320kbps (推荐)',
    740: '无损 (740kbps)',
    999: '超品 (999kbps)'
  } as const,
  
  // Default bit rate
  defaultBitRate: 320 as const,
  
  // Default page size for search results
  pageSize: 20,
  
  // API endpoint types
  endpoints: {
    search: 'search',
    url: 'url',
    pic: 'pic',
    lyric: 'lyric'
  } as const,
  
  // Image sizes for album covers
  imageSizes: {
    small: 90,
    medium: 300,
    large: 500
  } as const
};

export type MusicSource = typeof API_CONFIG.sources[number];
export type BitRate = typeof API_CONFIG.bitRates[number];

// Helper to build API URL with parameters
export function buildApiUrl(params: Record<string, string | number>, baseUrl = API_CONFIG.baseUrl): string {
  const url = new URL(baseUrl);
  Object.entries(params).forEach(([key, value]) => {
    url.searchParams.append(key, value.toString());
  });
  return url.toString();
}
