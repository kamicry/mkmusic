import React, { createContext, useContext, useState, useRef, useEffect } from 'react';
import { Music, Playlist, OrderMode } from '../types';

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
  
  setPlaylist: (id: number | undefined) => void;
  setPlayid: (id: number) => void;
  setDislist: (id: number) => void;
  setOrder: (order: OrderMode) => void;
  setPaused: (paused: boolean) => void;
  setErrCount: (count: number) => void;
  setVolume: (volume: number) => void;
  setMusicList: React.Dispatch<React.SetStateAction<Playlist[]>>;
  setWd: (wd: string) => void;
  setSource: (source: string) => void;
  setLoadPage: (page: number) => void;
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
