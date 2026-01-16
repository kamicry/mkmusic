import { Music } from '../types';

// LocalStorage utility functions for player data persistence

export const playerSavedata = (key: string, value: unknown): void => {
  try {
    if (typeof window !== 'undefined' && window.localStorage) {
      localStorage.setItem(`mkplayer_${key}`, JSON.stringify(value));
    }
  } catch (error) {
    console.error(`Failed to save ${key} to localStorage:`, error);
  }
};

export const playerReaddata = (key: string): unknown => {
  try {
    if (typeof window !== 'undefined' && window.localStorage) {
      const item = localStorage.getItem(`mkplayer_${key}`);
      return item ? JSON.parse(item) : null;
    }
    return null;
  } catch (error) {
    console.error(`Failed to read ${key} from localStorage:`, error);
    return null;
  }
};

export const playerRemovedata = (key: string): void => {
  try {
    if (typeof window !== 'undefined' && window.localStorage) {
      localStorage.removeItem(`mkplayer_${key}`);
    }
  } catch (error) {
    console.error(`Failed to remove ${key} from localStorage:`, error);
  }
};

// Play history management functions
export const savePlayHistory = (music: Music): void => {
  if (typeof window === 'undefined' || !window.localStorage) {
    return;
  }

  try {
    const historyKey = 'history';
    const existingHistory = (playerReaddata('history') as Music[]) || [];
    
    // Add playedAt timestamp
    const musicWithTimestamp = {
      ...music,
      playedAt: Date.now()
    };

    // Remove duplicate (same id and source)
    const filteredHistory = existingHistory.filter((item: Music) => 
      !(item.id === music.id && item.source === music.source)
    );

    // Add new music to the beginning
    const newHistory = [musicWithTimestamp, ...filteredHistory];

    // Keep only the latest 100 records
    const limitedHistory = newHistory.slice(0, 100);

    playerSavedata(historyKey, limitedHistory);
  } catch (error) {
    console.error('Failed to save play history:', error);
  }
};

export const getPlayHistory = (): Music[] => {
  if (typeof window === 'undefined' || !window.localStorage) {
    return [];
  }

  try {
    const history = (playerReaddata('history') as Music[]) || [];
    return history;
  } catch (error) {
    console.error('Failed to get play history:', error);
    return [];
  }
};

export const clearPlayHistory = (): void => {
  if (typeof window === 'undefined' || !window.localStorage) {
    return;
  }

  try {
    playerRemovedata('history');
  } catch (error) {
    console.error('Failed to clear play history:', error);
  }
};

export const removePlayHistoryItem = (musicId: string, source: string): void => {
  if (typeof window === 'undefined' || !window.localStorage) {
    return;
  }

  try {
    const history = getPlayHistory();
    const filteredHistory = history.filter(item => 
      !(item.id === musicId && item.source === source)
    );
    playerSavedata('history', filteredHistory);
  } catch (error) {
    console.error('Failed to remove play history item:', error);
  }
};

// Initialize player data from localStorage
export const initPlayerData = (): Record<string, unknown> => {
  const data: Record<string, unknown> = {};

  // Only run on client side
  if (typeof window === 'undefined') {
    return data;
  }

  // Load volume
  const volume = playerReaddata('volume');
  if (volume !== null) {
    data.volume = volume;
  }

  // Load playing list
  const playing = playerReaddata('playing');
  if (playing) {
    data.playing = playing;
  }

  // Load user data
  const uid = playerReaddata('uid');
  const uname = playerReaddata('uname');
  if (uid) data.uid = uid;
  if (uname) data.uname = uname;

  // Load user playlists
  const ulist = playerReaddata('ulist');
  if (ulist) data.ulist = ulist;

  return data;
};