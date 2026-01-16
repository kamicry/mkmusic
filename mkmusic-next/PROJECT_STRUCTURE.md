# Project Structure

## Directory Tree

```
mkmusic-next/
├── src/
│   ├── config/                    # Configuration files
│   │   └── api.config.ts          # ✨ NEW: API configuration & rate limiter
│   │
│   ├── components/                # React components
│   │   ├── BtnBar.tsx            # Button bar component
│   │   ├── Center.tsx            # Center container
│   │   ├── DataArea.tsx          # Data display area
│   │   ├── Footer.tsx            # Footer component
│   │   ├── Header.tsx            # Header component
│   │   ├── LyricPanel.tsx        # 🔄 UPDATED: Lyrics display (adapted for new API)
│   │   ├── MainPlayer.tsx        # Main player component
│   │   ├── MusicList.tsx         # Music list component
│   │   └── SearchPanel.tsx       # 🔄 UPDATED: Search panel with bit rate & pagination
│   │
│   ├── contexts/                 # React contexts
│   │   └── PlayerContext.tsx     # 🔄 UPDATED: Player state management (added bitRate, pagination)
│   │
│   ├── hooks/                    # Custom React hooks
│   │   ├── useAudio.ts          # Audio playback hook
│   │   ├── useLayer.ts          # Layer (modal) hook
│   │   ├── usePlayerControls.ts # Player controls hook
│   │   └── useSearch.ts         # 🔄 UPDATED: Search hook (new API integration)
│   │
│   ├── pages/                    # Next.js pages
│   │   ├── _app.tsx             # 🔄 UPDATED: App wrapper (added new styles)
│   │   ├── _document.tsx        # Document wrapper
│   │   └── index.tsx            # 🔄 UPDATED: Main page (bitRate integration)
│   │
│   ├── styles/                   # CSS stylesheets
│   │   ├── global.css           # Global styles
│   │   ├── globals.css          # Next.js global styles
│   │   ├── jquery.mCustomScrollbar.min.css  # Scrollbar styles
│   │   ├── layer/               # Layer modal styles
│   │   ├── player.css           # Player styles
│   │   ├── small.css            # Small screen styles
│   │   └── search-panel.css     # ✨ NEW: Search panel specific styles
│   │
│   ├── types/                    # TypeScript types directory
│   │
│   ├── utils/                    # Utility functions
│   │   ├── api.ts               # 🔄 UPDATED: API functions (completely rewritten)
│   │   ├── lyric.ts             # Lyric parsing utilities
│   │   └── musicList.ts         # Music list utilities
│   │
│   └── types.ts                  # TypeScript type definitions
│
├── public/                       # Static assets
│   ├── images/                  # Image files
│   └── ...
│
├── .gitignore                    # Git ignore rules
├── .node-version                 # Node version specification
├── .nvmrc                        # NVM configuration
├── eslint.config.mjs             # ESLint configuration
├── next.config.js                # Next.js configuration
├── next.config.ts                # Next.js TypeScript config
├── package.json                  # NPM dependencies
├── package-lock.json             # NPM lock file
├── postcss.config.mjs            # PostCSS configuration
├── tsconfig.json                 # TypeScript configuration
│
├── API_MIGRATION.md              # ✨ NEW: API migration documentation
├── API_TEST.md                   # ✨ NEW: Testing guide
├── CHANGELOG.md                  # ✨ NEW: Change log
├── PROJECT_STRUCTURE.md          # ✨ NEW: This file
├── QUICKSTART.md                 # ✨ NEW: Quick start guide
├── README.md                     # 🔄 UPDATED: Project overview
└── TASK_COMPLETION_SUMMARY.md    # ✨ NEW: Task completion summary
```

## Legend

- ✨ NEW: Newly created file
- 🔄 UPDATED: Modified existing file
- No mark: Existing file, unchanged

---

## Key Directories

### `/src/config/`
**Purpose**: Configuration files  
**Key File**: `api.config.ts`
- API endpoint configuration
- Music source definitions
- Bit rate options
- Rate limiter implementation

### `/src/components/`
**Purpose**: React UI components  
**Key Updates**:
- `SearchPanel.tsx` - Enhanced with bit rate selector and pagination
- `LyricPanel.tsx` - Adapted for new API response format

### `/src/contexts/`
**Purpose**: React Context providers  
**Key File**: `PlayerContext.tsx`
- Global state management
- Added: bitRate, currentPage, totalPages states

### `/src/hooks/`
**Purpose**: Custom React hooks  
**Key Updates**:
- `useSearch.ts` - Integrated with new GD Studio API
- Implements pagination logic

### `/src/utils/`
**Purpose**: Utility functions  
**Key File**: `api.ts`
- Completely rewritten for GD Studio API
- All API interaction functions
- Rate limiting
- Error handling

### `/src/styles/`
**Purpose**: CSS stylesheets  
**New File**: `search-panel.css`
- Bit rate selector styles
- Pagination controls styles
- Responsive design

---

## Core Files Breakdown

### Configuration

#### `src/config/api.config.ts` ✨ NEW
```typescript
- API_CONFIG: Main configuration object
  - baseUrl: GD Studio API URL
  - sources: Supported music sources
  - bitRates: Available bit rates
  - defaultBitRate: Default bit rate (320)
  - pageSize: Search results per page (20)
  
- Types:
  - MusicSource: 'netease' | 'kuwo' | 'joox'
  - BitRate: 128 | 192 | 320 | 740 | 999
  
- RateLimiter class:
  - canMakeRequest(): Check if request allowed
  - recordRequest(): Record a request
  - getRequestCount(): Get current request count
  - getRemainingRequests(): Get remaining requests
```

### API Functions

#### `src/utils/api.ts` 🔄 UPDATED
```typescript
- ajaxSearch(keyword, source, page, count): Search music
- ajaxUrl(music, bitRate): Get music URL with bit rate
- ajaxPic(music, size): Get album cover
- ajaxLyric(music): Get lyrics
- getRateLimiterStatus(): Get rate limiter info
```

### State Management

#### `src/contexts/PlayerContext.tsx` 🔄 UPDATED
```typescript
New States:
- bitRate: BitRate (128-999)
- currentPage: number (current search page)
- totalPages: number (total search pages)

New Setters:
- setBitRate(bitRate: BitRate)
- setCurrentPage(page: number)
- setTotalPages(pages: number)
```

### UI Components

#### `src/components/SearchPanel.tsx` 🔄 UPDATED
```typescript
Features:
- Search input
- Music source selection (netease/kuwo/joox)
- Bit rate dropdown (128/192/320/740/999)
- Pagination controls:
  - Previous/Next buttons
  - Page jump dropdown
  - Current page indicator
- API attribution footer
```

---

## Data Flow

### Search Flow
```
User Input (SearchPanel)
    ↓
SearchPanel state
    ↓
onSearch callback
    ↓
useSearch.performSearch()
    ↓
ajaxSearch() [api.ts]
    ↓
GD Studio API
    ↓
Response processing
    ↓
Update musicList (PlayerContext)
    ↓
MusicList component renders
```

### Playback Flow
```
User clicks song (MusicList)
    ↓
handleItemClick (index.tsx)
    ↓
Update playid & playlist
    ↓
useEffect triggers
    ↓
ajaxUrl(music, bitRate) [api.ts]
    ↓
GD Studio API
    ↓
Set audio.src
    ↓
Audio plays
```

### Lyrics Flow
```
Song changes (playid update)
    ↓
LyricPanel useEffect
    ↓
ajaxLyric(music) [api.ts]
    ↓
GD Studio API
    ↓
Parse LRC format
    ↓
Display with sync
```

---

## File Dependencies

### Core Dependencies
```
PlayerContext
    ↓
├── All Hooks (useSearch, useAudio, usePlayerControls)
├── All Components (SearchPanel, MainPlayer, etc.)
└── Pages (index.tsx)

api.config.ts
    ↓
├── api.ts (uses config)
├── PlayerContext (uses BitRate type)
└── SearchPanel (uses config constants)

api.ts
    ↓
├── useSearch (search functionality)
├── index.tsx (music URL, lyrics)
└── LyricPanel (lyrics)
```

---

## TypeScript Types

### Core Types Location: `src/types.ts`

```typescript
Music: {
  id, name, artist, album, source,
  url_id, pic_id, lyric_id,
  pic, url
}

Playlist: {
  id, name, cover,
  item: Music[],
  creatorName?: string
}

OrderMode: 1 | 2 | 3
  (1=single, 2=list, 3=random)

LyricLine: {
  time: number,
  text: string
}
```

### New Types Location: `src/config/api.config.ts`

```typescript
MusicSource: 'netease' | 'kuwo' | 'joox'
BitRate: 128 | 192 | 320 | 740 | 999
```

---

## Style Architecture

### CSS Cascade
```
globals.css (Next.js defaults)
    ↓
global.css (App-wide styles)
    ↓
player.css (Player-specific)
    ↓
small.css (Mobile responsive)
    ↓
search-panel.css (Search-specific)
    ↓
jquery.mCustomScrollbar.min.css (Scrollbar)
    ↓
layer/layer.css (Modals)
```

---

## Build Process

### Development
```bash
npm run dev
    ↓
Next.js dev server (port 3000)
    ↓
Hot reload enabled
    ↓
TypeScript compilation on-the-fly
```

### Production
```bash
npm run build
    ↓
TypeScript compilation
    ↓
Next.js optimization
    ↓
Static files generation
    ↓
npm start (production server)
```

---

## Environment Requirements

- Node.js: 18.x (specified in .nvmrc)
- npm: ≥ 9.0.0
- TypeScript: Latest (from Next.js)
- React: 18.x
- Next.js: 14.x

---

## API Integration Points

### External API: GD Studio
**Base URL**: `https://music-api.gdstudio.xyz/api.php`

**Endpoints Used**:
1. `/api.php?types=search` - Music search
2. `/api.php?types=url` - Get music URL
3. `/api.php?types=pic` - Get album cover
4. `/api.php?types=lyric` - Get lyrics

**Rate Limit**: 50 requests / 5 minutes

---

## Documentation Files

1. **README.md** - Project overview and features
2. **API_MIGRATION.md** - Detailed API documentation
3. **API_TEST.md** - Comprehensive testing guide
4. **CHANGELOG.md** - Version history and changes
5. **QUICKSTART.md** - Quick start for users
6. **PROJECT_STRUCTURE.md** - This file
7. **TASK_COMPLETION_SUMMARY.md** - Task completion details

---

## Key Features by File

### Bit Rate Selection
- **Config**: `src/config/api.config.ts` (bitRates array)
- **Context**: `src/contexts/PlayerContext.tsx` (bitRate state)
- **UI**: `src/components/SearchPanel.tsx` (dropdown)
- **API**: `src/utils/api.ts` (ajaxUrl with br param)
- **Usage**: `src/pages/index.tsx` (pass bitRate to ajaxUrl)

### Pagination
- **Config**: `src/config/api.config.ts` (pageSize)
- **Context**: `src/contexts/PlayerContext.tsx` (currentPage, totalPages)
- **UI**: `src/components/SearchPanel.tsx` (controls)
- **Logic**: `src/hooks/useSearch.ts` (page handling)
- **API**: `src/utils/api.ts` (ajaxSearch with pages param)

### Rate Limiting
- **Implementation**: `src/config/api.config.ts` (RateLimiter class)
- **Usage**: `src/utils/api.ts` (request function)
- **Config**: 50 requests / 5 minutes

---

## Testing Coverage

Refer to `API_TEST.md` for:
- 9 major test categories
- 20+ detailed test cases
- Step-by-step testing procedures
- Expected results
- Troubleshooting guides

---

**Document Version**: 1.0  
**Last Updated**: 2025-01-15  
**Maintained by**: Development Team
