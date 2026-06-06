# Recent Changes

This document records the recent implementation changes made around playback stability, search behavior, playlist loading, and legacy browser support.

## Summary

The project now keeps search results separate from the active playback queue, loads ranking playlists on demand, and routes playlist requests through the GD Music web endpoint that supports `types=playlist`. Several compatibility fixes were also added for older Safari versions such as iOS 12.

## Changed Files

### `src/config/api.config.ts`

Added a dedicated playlist endpoint:

```ts
playlistBaseUrl: 'https://music.gdstudio.org/api.php'
```

The existing `baseUrl` remains unchanged and is still used for search, playback URLs, covers, and lyrics:

```ts
baseUrl: 'https://music-api.gdstudio.xyz/api.php'
```

`buildApiUrl` now accepts an optional `baseUrl` parameter. This allows individual API helpers to choose the correct backend without changing every call site.

### `src/utils/api.ts`

The shared `request` helper now accepts an optional base URL and uses it when building request URLs.

`ajaxPlaylist` now calls:

```text
https://music.gdstudio.org/api.php?types=playlist&id=...
```

Other helpers still use the documented API endpoint:

- `ajaxSearch`
- `ajaxUrl`
- `ajaxPic`
- `ajaxLyric`

The request helper also avoids hard failure in browsers without `AbortController`. If `AbortController` is unavailable, it falls back to a plain `fetch`.

### `src/pages/index.tsx`

Search behavior was changed so searching does not replace the active playback queue.

Before:

```ts
newList[0].item = items;
newList[1].item = items;
```

Now:

```ts
newList[0].item = items;
```

This prevents the currently playing song from changing when the user only performs a search.

Playlist/ranking loading was changed from eager loading to click-time loading. On page load, the app only initializes the configured playlist metadata from `defaultMusicList`. When a user clicks a recommendation with a numeric `id` and an empty `item` list, the app fetches that playlist and stores the tracks in the matching `musicList` entry.

Custom playlists are not overwritten because they already contain `item` data.

### `src/components/LyricPanel.tsx`

Lyric loading now tracks a stable lyric key so the same lyric request is not repeated unnecessarily. It also uses a cancellation flag to prevent stale async responses from updating state after the selected song changes.

Scrolling was changed from object-form `scrollTo` to direct `scrollTop` assignment for older Safari compatibility.

### `src/hooks/useLyric.ts`

Legacy lyric hook scrolling was also changed to `scrollTop` so future usage does not reintroduce the same old Safari issue.

### `src/components/MusicInfoPanel.tsx`

Clipboard copying now has a fallback path using a temporary textarea and `document.execCommand('copy')`. This helps browsers that do not support `navigator.clipboard.writeText`.

### `src/contexts/PlayerContext.tsx`

Playback history actions were wrapped with `useCallback`. This keeps function identity stable for consumers that use these callbacks in effect dependencies.

## Current Playlist Loading Model

1. `defaultMusicList` provides static metadata for search, playing, history, recommendation playlists, and the custom playlist.
2. The homepage initializes `musicList` from `defaultMusicList`.
3. Recommendation cards are rendered from `musicList.slice(3)`.
4. When a recommendation is clicked:
   - The app switches to that list view immediately.
   - If the list already has songs, no request is made.
   - If the list has a numeric `id` and no songs, `ajaxPlaylist` loads tracks from `music.gdstudio.org`.
5. Clicking a song copies the selected list into the playing queue and starts playback.

## Verification

The latest build was verified with:

```bash
npm run build
```

The `.org` playlist endpoint was also checked manually with:

```text
https://music.gdstudio.org/api.php?types=playlist&id=3778678
```

It returned playlist data with `code: 200`.

## Notes

The repository still has older documentation files that describe previous migration work. This file describes the most recent behavior and should be treated as the current reference for the changes above.
