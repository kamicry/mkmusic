import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { initialMusicList } from '../utils/musicList';
import { playerReaddata } from '../utils/storage';
import { MusicItem, Playlist, PlayerConfig } from '../types/player';

// Define the player context interface
interface PlayerContextType {
  audioRef: React.RefObject<HTMLAudioElement | null>;
  playlist: number | undefined;
  playid: number | undefined;
  dislist: number;
  loadPage: number;
  wd: string;
  source: string;
  uid: string;
  uname: string;
  isMobile: boolean;
  errCount: number;
  paused: boolean;
  order: number;
  volume: number;
  webTitle: string;
  musicList: Playlist[];
  lyric: Record<number, string> | '';
  lastLyric: number;
  titflash: NodeJS.Timeout | undefined;
  sheetList: HTMLElement | null;
  mainList: HTMLElement | null;
  config: PlayerConfig;
  setPlaylist: (playlist: number) => void;
  setPlayid: (playid: number) => void;
  setDislist: (dislist: number) => void;
  setLoadPage: (loadPage: number) => void;
  setWd: (wd: string) => void;
  setSource: (source: string) => void;
  setUid: (uid: string) => void;
  setUname: (uname: string) => void;
  setErrCount: (errCount: number) => void;
  setPaused: (paused: boolean) => void;
  setOrder: (order: number) => void;
  setVolume: (volume: number) => void;
  setMusicList: (musicList: Playlist[]) => void;
  setLyric: (lyric: Record<number, string> | '') => void;
  setLastLyric: (lastLyric: number) => void;
  setTitflash: (titflash: NodeJS.Timeout | undefined) => void;
  setSheetList: (sheetList: HTMLElement | null) => void;
  setMainList: (mainList: HTMLElement | null) => void;
}

// Create the player context
const PlayerContext = createContext<PlayerContextType | undefined>(undefined);

// Player provider component
export const PlayerProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const audioRef = React.useRef<HTMLAudioElement>(null);
  
  // Initialize state from localStorage or defaults
  const [playlist, setPlaylist] = useState<number | undefined>(undefined);
  const [playid, setPlayid] = useState<number | undefined>(undefined);
  const [dislist, setDislist] = useState<number>(3); // Default to history list
  const [loadPage, setLoadPage] = useState<number>(1);
  const [wd, setWd] = useState<string>('');
  const [source, setSource] = useState<string>('netease');
  const [uid, setUid] = useState<string>('');
  const [uname, setUname] = useState<string>('');
  const [isMobile, setIsMobile] = useState<boolean>(false);
  const [errCount, setErrCount] = useState<number>(0);
  const [paused, setPaused] = useState<boolean>(true);
  const [order, setOrder] = useState<number>(2); // Default to list loop
  const [volume, setVolume] = useState<number>(() => {
    const savedVolume = playerReaddata('volume');
    return savedVolume !== null ? savedVolume : 0.6;
  });
  const [webTitle, setWebTitle] = useState<string>('MKOnlinePlayer v2.4');
  const [musicList, setMusicList] = useState<Playlist[]>([]);
  const [lyric, setLyric] = useState<Record<number, string> | ''>('');
  const [lastLyric, setLastLyric] = useState<number>(-1);
  const [titflash, setTitflash] = useState<NodeJS.Timeout | undefined>(undefined);
  const [sheetList, setSheetList] = useState<HTMLElement | null>(null);
  const [mainList, setMainList] = useState<HTMLElement | null>(null);

  // Player configuration
  const config: PlayerConfig = {
    api: 'api.php',
    loadcount: 20,
    method: 'POST',
    defaultlist: 3,
    autoplay: false,
    coverbg: true,
    mcoverbg: true,
    dotshine: true,
    mdotshine: false,
    volume: 0.6,
    version: 'v2.41',
    debug: false
  };

  // Initialize music list on first render
  useEffect(() => {
    // Load initial music list
    setMusicList(initialMusicList);
    
    // Load saved playing list
    const savedPlaying = playerReaddata('playing');
    if (savedPlaying && savedPlaying.length > 0) {
      const updatedMusicList = [...initialMusicList];
      updatedMusicList[1].item = savedPlaying;
      setMusicList(updatedMusicList);
    }
    
    // Load user data
    const savedUid = playerReaddata('uid');
    const savedUname = playerReaddata('uname');
    if (savedUid) setUid(savedUid);
    if (savedUname) setUname(savedUname);
    
    // Load user playlists
    const savedUlist = playerReaddata('ulist');
    if (savedUlist && savedUlist.length > 0) {
      const updatedMusicList = [...initialMusicList, ...savedUlist];
      setMusicList(updatedMusicList);
    }
  }, []);

  // Detect mobile device
  useEffect(() => {
    const checkMobile = () => {
      const userAgent = navigator.userAgent;
      const isMobileDevice = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(userAgent);
      setIsMobile(isMobileDevice);
    };
    
    checkMobile();
  }, []);

  return (
    <PlayerContext.Provider value={
      {
        audioRef,
        playlist,
        playid,
        dislist,
        loadPage,
        wd,
        source,
        uid,
        uname,
        isMobile,
        errCount,
        paused,
        order,
        volume,
        webTitle,
        musicList,
        lyric,
        lastLyric,
        titflash,
        sheetList,
        mainList,
        config,
        setPlaylist,
        setPlayid,
        setDislist,
        setLoadPage,
        setWd,
        setSource,
        setUid,
        setUname,
        setErrCount,
        setPaused,
        setOrder,
        setVolume,
        setMusicList,
        setLyric,
        setLastLyric,
        setTitflash,
        setSheetList,
        setMainList
      }
    }>
      {children}
    </PlayerContext.Provider>
  );
};

// Custom hook to use player context
export const usePlayer = () => {
  const context = useContext(PlayerContext);
  if (context === undefined) {
    throw new Error('usePlayer must be used within a PlayerProvider');
  }
  return context;
};