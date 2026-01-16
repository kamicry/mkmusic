import React, { createContext, useContext, useState, useRef, useEffect } from 'react';
import { Music, Playlist, OrderMode, Config, LyricLine } from '../types';
import { API_CONFIG, BitRate } from '../config/api.config';

interface PlayerContextType {
  audioRef: React.RefObject<HTMLAudioElement | null>;
  playlist: number | undefined;
  playid: number;
  dislist: number;
  order: OrderMode;
  paused: boolean;
  errCount: number;
  volume: number;
  isMobile: boolean;
  musicList: Playlist[];
  wd: string;
  source: string;
  loadPage: number;
  lyric: { [key: number]: string } | null;
  lastLyric: number;
  bitRate: BitRate;
  currentPage: number;
  totalPages: number;
  showTranslation: boolean;
  originalLyrics: LyricLine[];
  translatedLyrics: LyricLine[];
  hasTranslation: boolean;
  
  setPlaylist: (id: number | undefined) => void;
  setPlayid: (id: number) => void;
  setDislist: (id: number) => void;
  setOrder: (order: OrderMode) => void;
  setPaused: (paused: boolean) => void;
  setErrCount: React.Dispatch<React.SetStateAction<number>>;
  setVolume: (volume: number) => void;
  setMusicList: React.Dispatch<React.SetStateAction<Playlist[]>>;
  setWd: (wd: string) => void;
  setSource: (source: string) => void;
  setLoadPage: (page: number) => void;
  setLyric: (lyric: { [key: number]: string } | null) => void;
  setLastLyric: (lyric: number) => void;
  setBitRate: (bitRate: BitRate) => void;
  setCurrentPage: (page: number) => void;
  setTotalPages: (pages: number) => void;
  setShowTranslation: (show: boolean) => void;
  setOriginalLyrics: (lyrics: LyricLine[]) => void;
  setTranslatedLyrics: (lyrics: LyricLine[]) => void;
  setHasTranslation: (has: boolean) => void;
}

const PlayerContext = createContext<PlayerContextType | undefined>(undefined);

export const PlayerProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [playlist, setPlaylist] = useState<number | undefined>(undefined);
  const [playid, setPlayid] = useState<number>(0);
  const [dislist, setDislist] = useState<number>(0);
  const [order, setOrder] = useState<OrderMode>(2);
  const [paused, setPaused] = useState<boolean>(true);
  const [errCount, setErrCount] = useState<number>(0);
  const [volume, setVolume] = useState<number>(0.6);
  const [isMobile, setIsMobile] = useState<boolean>(false);
  const [wd, setWd] = useState<string>('');
  const [source, setSource] = useState<string>('netease');
  const [loadPage, setLoadPage] = useState<number>(1);
  const [musicList, setMusicList] = useState<Playlist[]>([]);
  const [lyric, setLyric] = useState<{ [key: number]: string } | null>(null);
  const [lastLyric, setLastLyric] = useState<number>(0);
  const [bitRate, setBitRate] = useState<BitRate>(API_CONFIG.defaultBitRate);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [showTranslation, setShowTranslation] = useState<boolean>(false);
  const [originalLyrics, setOriginalLyrics] = useState<LyricLine[]>([]);
  const [translatedLyrics, setTranslatedLyrics] = useState<LyricLine[]>([]);
  const [hasTranslation, setHasTranslation] = useState<boolean>(false);

  useEffect(() => {
    const checkMobile = () => {
      const ua = navigator.userAgent;
      return /Android|BlackBerry|iPhone|iPad|iPod|IEMobile/i.test(ua);
    };
    setIsMobile(checkMobile());
    
    // Load volume from localStorage
    const savedVolume = localStorage.getItem('player_volume');
    if (savedVolume) {
      setVolume(parseFloat(savedVolume));
    }
  }, []);

  const value = {
    audioRef,
    playlist,
    playid,
    dislist,
    order,
    paused,
    errCount,
    volume,
    isMobile,
    musicList,
    wd,
    source,
    loadPage,
    lyric,
    lastLyric,
    bitRate,
    currentPage,
    totalPages,
    showTranslation,
    originalLyrics,
    translatedLyrics,
    hasTranslation,
    setPlaylist,
    setPlayid,
    setDislist,
    setOrder,
    setPaused,
    setErrCount,
    setVolume,
    setMusicList,
    setWd,
    setSource,
    setLoadPage,
    setLyric,
    setLastLyric,
    setBitRate,
    setCurrentPage,
    setTotalPages,
    setShowTranslation,
    setOriginalLyrics,
    setTranslatedLyrics,
    setHasTranslation,
  };

  return <PlayerContext.Provider value={value}>{children}</PlayerContext.Provider>;
};

export const usePlayerContext = () => {
  const context = useContext(PlayerContext);
  if (context === undefined) {
    throw new Error('usePlayerContext must be used within a PlayerProvider');
  }
  return context;
};

export const usePlayer = usePlayerContext;
