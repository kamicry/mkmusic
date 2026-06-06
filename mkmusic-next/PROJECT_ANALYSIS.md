# Project Analysis

This document explains the current project structure, state model, data flow, API layer, and playback behavior.

## Overview

This is a Next.js pages-router music player built with React 18 and TypeScript. The UI is split into a central list/sheet/player view, a footer player control bar, a main player/lyric area, search modal, and music detail modal.

The app keeps most runtime state in `PlayerContext`, while `src/pages/index.tsx` coordinates the user workflow: initialize playlists, search, select songs, load playlists, fetch playback URLs, and update history.

## Main Directories

### `src/pages`

`src/pages/index.tsx` is the main screen. It orchestrates:

- Initial playlist state
- Mobile/desktop view switching
- Search result loading
- Recommendation playlist click handling
- Song selection
- Audio URL loading
- Cover loading
- Playback history updates
- Search and detail modal visibility

`src/pages/_app.tsx` wires global providers and imports global CSS.

### `src/components`

Important components:

- `Header.tsx`: top logo/header.
- `BtnBar.tsx`: switches between player, current list, playlist sheet, and search.
- `MusicList.tsx`: renders track rows and history deletion controls.
- `SearchPanel.tsx`: search form, source selector, bitrate selector, and pagination controls.
- `MainPlayer.tsx`: cover, lyric panel, and current song info.
- `LyricPanel.tsx`: lyric fetching, parsing, translation toggle, highlight, and scroll.
- `Footer.tsx`: playback buttons, volume, and progress bar.
- `MusicInfoPanel.tsx`: detailed song metadata and copyable resource links.

### `src/contexts`

`PlayerContext.tsx` is the global state container. It stores:

- Audio ref
- Current playback list index: `playlist`
- Current song index: `playid`
- Displayed list index: `dislist`
- Playback order, paused state, volume, and error count
- Search state: keyword, source, page
- `musicList`
- Bitrate
- Lyric/translation state
- Playback history

It also loads volume and playback history from browser storage.

### `src/utils`

`api.ts` wraps GD Studio API calls:

- `ajaxSearch`: search tracks.
- `ajaxUrl`: resolve a playable audio URL.
- `ajaxPic`: resolve cover image URL.
- `ajaxLyric`: fetch original and translated lyrics.
- `ajaxPlaylist`: fetch playlist/ranking tracks from the GD Music web endpoint.

`musicList.ts` defines the initial list model. The first three entries are structural lists:

- Search results
- Currently playing
- Playback history

Entries from index 3 onward are shown in the recommendation sheet. Numeric IDs are treated as remote playlists. Entries with prefilled `item` arrays, such as the custom list, are treated as local/static playlists.

`storage.ts` handles localStorage for player data and playback history.

`lyric.ts` parses timestamped lyric text and calculates the active lyric line.

## Data Model

The core item type is `Music`:

```ts
interface Music {
  id: string;
  name: string;
  artist: string;
  album: string;
  source: string;
  url_id: string;
  pic_id: string;
  lyric_id: string;
  pic: string | null;
  url: string | null;
}
```

The core list type is `Playlist`:

```ts
interface Playlist {
  id?: string;
  name: string;
  cover: string;
  item: Music[];
}
```

The code uses list indexes as workflow slots:

- `0`: search results
- `1`: currently playing queue
- `2`: playback history
- `3+`: recommendation and custom playlists

This index convention is important. Components often pass indexes rather than list IDs.

## API Design

The app uses two GD Studio endpoints:

```ts
baseUrl: 'https://music-api.gdstudio.xyz/api.php'
playlistBaseUrl: 'https://music.gdstudio.org/api.php'
```

The documented API endpoint is used for:

- Search
- Playback URLs
- Covers
- Lyrics

The playlist endpoint is separate because the documented `music-api.gdstudio.xyz` endpoint does not support `types=playlist`. The GD Music web endpoint does support it.

The shared request helper deduplicates concurrent requests by full URL with an `inFlightRequests` map. It also uses `AbortController` where available, but falls back to plain fetch for older browsers.

## Search Flow

1. User submits the search modal.
2. `handleSearch` calls `ajaxSearch`.
3. API results are mapped into `Music` objects.
4. Only `musicList[0].item` is updated.
5. `dislist` is set to `0`, so the search result list is displayed.

Search does not change `musicList[1]`, `playlist`, or `playid`, so it does not interrupt the currently playing song.

When the user clicks a search result:

1. `handleItemClick` detects `dislist === 0`.
2. It copies search results into `musicList[1]`.
3. It sets `playlist = 1` and `playid = clicked index`.
4. The playback effect loads and plays that song.

## Recommendation Playlist Flow

1. The playlist sheet renders `musicList.slice(3)`.
2. Clicking a sheet card calls `handleSheetClick(index)`.
3. The app switches to the selected list view immediately.
4. If that list is empty and has a numeric `id`, `ajaxPlaylist` loads tracks.
5. Loaded tracks are stored into that same `musicList` entry.
6. Subsequent clicks do not reload if the list already has items.

This avoids loading every playlist on initial page load.

## Playback Flow

Playback is driven by `playlist`, `playid`, `musicList`, and `bitRate`.

The homepage derives `currentMusic` from:

```ts
musicList[playlist]?.item[playid]
```

When the current music key changes:

1. Cover is loaded with `ajaxPic` if missing.
2. Audio URL is loaded with `ajaxUrl` if missing.
3. `audio.src` is set.
4. `audio.play()` is called.
5. The song is added to playback history after playback starts.

The code uses `lastLoadedAudioKeyRef` to avoid reloading the same song/bitrate repeatedly.

## Lyrics Flow

`LyricPanel` loads lyrics for the current song through `ajaxLyric`.

It stores:

- Original lyrics
- Translated lyrics
- Whether translation exists
- Current lyric line index

The active lyric line is calculated from `audio.currentTime`. Scrolling uses `scrollTop` for better compatibility with older Safari.

## Playback History

Playback history is stored in localStorage through `storage.ts`.

When a song starts playing:

1. `addToPlayHistory` saves it.
2. Existing entries with the same `id` and `source` are deduplicated.
3. Newer entries are placed first.
4. History is capped at 100 entries.

The history list is mirrored into `musicList[2]` so it can be displayed like other lists.

## Compatibility Notes

Several changes target older browsers:

- `AbortController` is optional in the API request helper.
- Lyric scrolling avoids object-form `scrollTo`.
- Clipboard copy has a textarea fallback.

These choices are especially relevant for iOS 12 Safari.

## Important Constraints

The app relies on fixed `musicList` indexes. If future work changes the ordering in `defaultMusicList`, update any code that assumes:

- `0` is search
- `1` is playing
- `2` is history
- `3+` are sheets

The app also mutates list membership by copying displayed lists into `musicList[1]` when a song is selected. This is intentional: the active playback queue is separate from the displayed recommendation/search list.

## Suggested Future Improvements

- Move playlist response types and mapping helpers out of `index.tsx` into `utils/api.ts` or a dedicated mapper module.
- Add loading state per playlist card so users can see when a clicked playlist is being fetched.
- Use IDs instead of hardcoded list indexes for less fragile state transitions.
- Add unit tests around search not interrupting playback and playlist lazy loading.
- Remove or refresh older documentation files that describe obsolete API behavior.
