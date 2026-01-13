// LocalStorage utility functions for player data persistence

export const playerSavedata = (key: string, value: any): void => {
  try {
    if (typeof window !== 'undefined' && window.localStorage) {
      localStorage.setItem(`mkplayer_${key}`, JSON.stringify(value));
    }
  } catch (error) {
    console.error(`Failed to save ${key} to localStorage:`, error);
  }
};

export const playerReaddata = (key: string): any => {
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

// Initialize player data from localStorage
export const initPlayerData = (): Record<string, any> => {
  const data: Record<string, any> = {};

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