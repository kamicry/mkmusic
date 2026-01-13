import { useEffect } from 'react';
import { usePlayer } from '../contexts/PlayerContext';

export const useAudio = () => {
  const {
    audioRef,
    playlist,
    playid,
    musicList,
    setPaused,
    paused,
    config,
    setErrCount,
    errCount,
    order,
    setLyric,
    setLastLyric
  } = usePlayer();

  // Audio event handlers
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const handleTimeUpdate = () => {
      if (paused) return;
      // Sync progress bar and lyrics
      // This will be handled by other hooks/components
    };

    const handlePlay = () => {
      setPaused(false);
      // Additional play logic
    };

    const handlePause = () => {
      setPaused(true);
      // Additional pause logic
    };

    const handleEnded = () => {
      // Auto play next song based on order mode
      if (order === 1) {
        // Single loop - replay same song
        if (playlist !== undefined && playid !== undefined) {
          playMusic(playlist, playid);
        }
      } else {
        // List loop or random
        playNextSong();
      }
    };

    const handleError = () => {
      if (errCount > 10) {
        alert('似乎出了点问题~播放已停止');
        setErrCount(0);
      } else {
        setErrCount(errCount + 1);
        playNextSong();
      }
    };

    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('play', handlePlay);
    audio.addEventListener('pause', handlePause);
    audio.addEventListener('ended', handleEnded);
    audio.addEventListener('error', handleError);

    return () => {
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('play', handlePlay);
      audio.removeEventListener('pause', handlePause);
      audio.removeEventListener('ended', handleEnded);
      audio.removeEventListener('error', handleError);
    };
  }, [audioRef, paused, playlist, playid, order, errCount, setErrCount, setPaused]);

  // Play music function
  const playMusic = (playlistId: number, musicId: number) => {
    if (playlistId >= musicList.length || musicId >= musicList[playlistId].item.length) {
      return;
    }

    const music = musicList[playlistId].item[musicId];

    if (!music.url || music.url === 'err') {
      // Fetch URL if not available
      fetchMusicUrl(music).then(url => {
        if (url && url !== 'err') {
          music.url = url;
          playMusic(playlistId, musicId);
        } else {
          audioError();
        }
      });
      return;
    }

    const audio = audioRef.current;
    if (audio) {
      try {
        audio.pause();
        audio.src = music.url;
        audio.play();
        setPaused(false);
        setErrCount(0);

        // Fetch lyrics
        if (music.lyric_id) {
          fetchLyrics(music).then(lyrics => {
            setLyric(lyrics);
          });
        }

        // Update cover
        // This will be handled by other components

      } catch (e) {
        audioError();
      }
    }
  };

  // Audio error handling
  const audioError = () => {
    if (errCount > 10) {
      alert('似乎出了点问题~播放已停止');
      setErrCount(0);
    } else {
      setErrCount(errCount + 1);
      playNextSong();
    }
  };

  // Play next song based on order mode
  const playNextSong = () => {
    if (playlist === undefined || playid === undefined) return;

    let nextId = playid;
    
    switch (order) {
      case 1: // Single loop
        nextId = playid;
        break;
      case 2: // List loop
        nextId = playid + 1;
        if (nextId >= musicList[playlist].item.length) {
          nextId = 0;
        }
        break;
      case 3: // Random
        if (musicList[playlist]?.item.length) {
          nextId = Math.floor(Math.random() * musicList[playlist].item.length);
        }
        break;
      default:
        nextId = playid + 1;
        if (nextId >= musicList[playlist].item.length) {
          nextId = 0;
        }
    }

    playMusic(playlist, nextId);
  };

  // Fetch music URL from API
  const fetchMusicUrl = async (music: any): Promise<string> => {
    if (!music.id) return 'err';

    try {
      const response = await fetch(`${config.api}?types=url&id=${music.id}&source=${music.source}`);
      const data = await response.json();
      
      if (data.url === '') {
        return 'err';
      }
      return data.url;
    } catch (error) {
      console.error('Failed to fetch music URL:', error);
      return 'err';
    }
  };

  // Fetch lyrics from API
  const fetchLyrics = async (music: any): Promise<Record<number, string>> => {
    if (!music.lyric_id) return {};

    try {
      const response = await fetch(`${config.api}?types=lyric&id=${music.lyric_id}&source=${music.source}`);
      const data = await response.json();
      
      if (data.lyric) {
        return parseLyric(data.lyric);
      }
      return {};
    } catch (error) {
      console.error('Failed to fetch lyrics:', error);
      return {};
    }
  };

  // Parse LRC lyrics
  const parseLyric = (lrc: string): Record<number, string> => {
    if (!lrc) return {};

    const lyrics = lrc.split('\n');
    const lrcObj: Record<number, string> = {};

    for (let i = 0; i < lyrics.length; i++) {
      const lyric = decodeURIComponent(lyrics[i]);
      const timeReg = /\[\d*:\d*((\.|:)\d*)*\]/g;
      const timeRegExpArr = lyric.match(timeReg);

      if (!timeRegExpArr) continue;

      const clause = lyric.replace(timeReg, '');

      for (let k = 0; k < timeRegExpArr.length; k++) {
        const t = timeRegExpArr[k];
        const min = Number(String(t.match(/\[\d*/i))?.slice(1));
        const sec = Number(String(t.match(/:\d*/i))?.slice(1));
        const time = min * 60 + sec;
        lrcObj[time] = clause;
      }
    }

    return lrcObj;
  };

  return {
    playMusic,
    playNextSong,
    fetchMusicUrl,
    fetchLyrics,
    parseLyric
  };
};