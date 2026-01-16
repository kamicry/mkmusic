# API Migration Guide

## GD Studio's Online Music Platform API Integration

This document describes the migration from the original `api.php` to **GD Studio's Online Music Platform API**.

### API Information

- **Base URL**: `https://music-api.gdstudio.xyz/api.php`
- **Official Website**: [music.gdstudio.xyz](https://music.gdstudio.xyz)
- **Rate Limit**: 50 requests per 5 minutes
- **Original Authors**: metowolf & mengkun
- **Modified by**: GD Studio

### Supported Music Sources

Only the following **stable** music sources are now supported:

| Source ID | Display Name | Status |
|-----------|--------------|--------|
| `netease` | 网易云 | ✅ Stable |
| `kuwo` | 酷我 | ✅ Stable |
| `joox` | JOOX | ✅ Stable |

**Removed sources**: tencent, xiami, kugou, baidu, tidal, spotify

### API Endpoints

#### 1. Search Music
```
GET /api.php?types=search&name={keyword}&source={source}&pages={page}&count={count}
```

**Parameters:**
- `types`: `search` (required)
- `name`: Search keyword (required)
- `source`: Music source (netease/kuwo/joox)
- `pages`: Page number (default: 1)
- `count`: Results per page (default: 20)

**Response:**
```json
[
  {
    "id": "song_id",
    "name": "Song Name",
    "artist": ["Artist Name"],
    "album": "Album Name",
    "source": "netease",
    "pic_id": "album_pic_id",
    "lyric_id": "lyric_id"
  }
]
```

#### 2. Get Music URL
```
GET /api.php?types=url&id={music_id}&source={source}&br={bitrate}
```

**Parameters:**
- `types`: `url` (required)
- `id`: Music ID (required)
- `source`: Music source (required)
- `br`: Bit rate - 128/192/320/740/999 kbps (optional, default: 320)

**Response:**
```json
{
  "url": "https://music-url.com/song.mp3",
  "br": 320,
  "size": 5242880
}
```

**Bit Rate Options:**
- `128`: 128kbps
- `192`: 192kbps
- `320`: 320kbps (recommended, default)
- `740`: Lossless quality
- `999`: High-quality lossless

#### 3. Get Album Cover
```
GET /api.php?types=pic&id={pic_id}&source={source}&size={size}
```

**Parameters:**
- `types`: `pic` (required)
- `id`: Picture ID (required)
- `source`: Music source (required)
- `size`: Image size - 90/300/500 pixels (optional, default: 500)

**Response:**
```json
{
  "url": "https://image-url.com/cover.jpg"
}
```

#### 4. Get Lyrics
```
GET /api.php?types=lyric&id={lyric_id}&source={source}
```

**Parameters:**
- `types`: `lyric` (required)
- `id`: Lyric ID (required)
- `source`: Music source (required)

**Response:**
```json
{
  "lyric": "[00:00.00]Lyrics in LRC format\n[00:05.00]Second line",
  "tlyric": "[00:00.00]Chinese translation (optional)"
}
```

### New Features

#### 1. Bit Rate Selection
Users can now select the desired bit rate for music playback:

- 128kbps - Low quality, smaller file size
- 192kbps - Medium quality
- 320kbps - High quality (recommended default)
- 740kbps - Lossless quality
- 999kbps - Ultra-high lossless quality

The bit rate selector is available in the search panel.

#### 2. Page Navigation
Search results now support pagination with:

- Previous/Next page buttons
- Direct page jump dropdown
- Current page indicator
- Total pages display

Users can easily navigate through search results without loading all pages at once.

### Rate Limiting

The API enforces a rate limit of **50 requests per 5 minutes**. The application includes:

- Built-in rate limiter to track requests
- Error messages when rate limit is exceeded
- Automatic retry mechanism with appropriate delays

### Code Changes

#### Configuration File
- **New**: `src/config/api.config.ts` - Centralized API configuration

#### Updated Files
- `src/utils/api.ts` - Updated all API calls to use new endpoints
- `src/contexts/PlayerContext.tsx` - Added `bitRate`, `currentPage`, `totalPages` states
- `src/components/SearchPanel.tsx` - Added bit rate selector and pagination controls
- `src/hooks/useSearch.ts` - Updated to use new API with pagination support
- `src/pages/index.tsx` - Updated to pass bit rate to music URL requests
- `src/components/LyricPanel.tsx` - Updated to handle new lyric response format

### Usage Guidelines

1. **Attribution**: Please credit "GD音乐台(music.gdstudio.xyz)" when using this API
2. **Purpose**: This API is for learning and personal use only, not for commercial purposes
3. **Rate Limiting**: Respect the 50 requests per 5 minutes limit
4. **Error Handling**: Implement proper error handling for failed requests

### Error Handling

Common error responses:

- `403 Forbidden`: Rate limit exceeded
- `404 Not Found`: Resource not found
- `Network Error`: Connection timeout or network issues

The application displays user-friendly error messages for all error types.

### Testing

To test the new API integration:

1. **Search Functionality**
   - Search for songs with different sources (netease, kuwo, joox)
   - Test pagination navigation
   - Verify search results display correctly

2. **Playback Functionality**
   - Select different bit rates
   - Verify audio quality matches selected bit rate
   - Test playback across different music sources

3. **UI Features**
   - Check bit rate selector in search panel
   - Test page navigation controls
   - Verify error messages display correctly

### Migration Checklist

- [x] Update API configuration
- [x] Replace API endpoint URLs
- [x] Update music sources (remove unstable sources)
- [x] Add bit rate selection
- [x] Implement pagination controls
- [x] Update search functionality
- [x] Update music URL fetching with bit rate
- [x] Update album cover fetching
- [x] Update lyrics fetching
- [x] Implement rate limiting
- [x] Add error handling
- [x] Update UI components
- [x] Test all functionality

### Future Improvements

Potential enhancements for future versions:

1. Cache API responses to reduce request count
2. Add loading indicators for API calls
3. Implement request queue for better rate limiting
4. Add support for playlist export/import
5. Enhance error recovery mechanisms
6. Add retry logic with exponential backoff

### Support

For issues or questions about the API:
- Visit: [music.gdstudio.xyz](https://music.gdstudio.xyz)
- Original Project: metowolf & mengkun
- Modified by: GD Studio

---

**Note**: This API integration follows best practices for third-party API usage and includes proper error handling, rate limiting, and user feedback mechanisms.
