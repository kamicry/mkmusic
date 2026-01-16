/**
 * GD Studio's Online Music Platform API Configuration
 * 
 * API Documentation: https://music-api.gdstudio.xyz/api.php
 * Stable Music Sources: netease, kuwo, joox
 * Rate Limit: 50 requests per 5 minutes
 * 
 * Original API by metowolf & mengkun
 * Modified by GD Studio
 * 
 * Note: This API is for learning purposes only, not for commercial use.
 * Please credit "GD音乐台(music.gdstudio.xyz)" when using this API.
 */

export const API_CONFIG = {
  // Base URL for the music API
  baseUrl: 'https://music-api.gdstudio.xyz/api.php',
  
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
  
  // API request limit (50 requests per 5 minutes)
  requestLimit: 50,
  requestWindow: 5 * 60 * 1000, // 5 minutes in milliseconds
  
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
export function buildApiUrl(params: Record<string, string | number>): string {
  const url = new URL(API_CONFIG.baseUrl);
  Object.entries(params).forEach(([key, value]) => {
    url.searchParams.append(key, value.toString());
  });
  return url.toString();
}

// Rate limiting tracker
class RateLimiter {
  private requests: number[] = [];
  
  canMakeRequest(): boolean {
    const now = Date.now();
    // Remove requests older than the window
    this.requests = this.requests.filter(
      time => now - time < API_CONFIG.requestWindow
    );
    
    return this.requests.length < API_CONFIG.requestLimit;
  }
  
  recordRequest(): void {
    this.requests.push(Date.now());
  }
  
  getRequestCount(): number {
    const now = Date.now();
    this.requests = this.requests.filter(
      time => now - time < API_CONFIG.requestWindow
    );
    return this.requests.length;
  }
  
  getRemainingRequests(): number {
    return API_CONFIG.requestLimit - this.getRequestCount();
  }
}

export const rateLimiter = new RateLimiter();
