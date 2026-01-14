import { useEffect, useCallback } from 'react';
import { usePlayerContext } from '../contexts/PlayerContext';

export const useAudio = () => {
  const {
    audioRef,
    setPaused,
    setErrCount,
    volume,
    playlist,
    playid,
    musicList,
    order,
    setPlayid,
  } = usePlayerContext();

  const nextMusic = useCallback(() => {
    const currentList = musicList[1]?.item; // Playing list
    if (!currentList || currentList.length === 0) return;

    if (order === 3) { // Random
      const nextId = Math.floor(Math.random() * currentList.length);
      setPlayid(nextId);
    } else {
      setPlayid((playid + 1) % currentList.length);
    }
  }, [musicList, order, playid, setPlayid]);

  const handleEnded = useCallback(() => {
    if (order === 1) { // Single repeat
      if (audioRef.current) {
        audioRef.current.currentTime = 0;
        audioRef.current.play();
      }
    } else {
      nextMusic();
    }
  }, [order, audioRef, nextMusic]);

  const handleError = useCallback(() => {
    setErrCount((prev) => {
      if (prev > 10) {
        // layer.msg('似乎出了点问题~播放已停止');
        return 0;
      }
      // layer.msg('当前歌曲播放失败，自动播放下一首');
      nextMusic();
      return prev + 1;
    });
  }, [nextMusic, setErrCount]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const onPlay = () => setPaused(false);
    const onPause = () => setPaused(true);

    audio.addEventListener('play', onPlay);
    audio.addEventListener('pause', onPause);
    audio.addEventListener('ended', handleEnded);
    audio.addEventListener('error', handleError);

    return () => {
      audio.removeEventListener('play', onPlay);
      audio.removeEventListener('pause', onPause);
      audio.removeEventListener('ended', handleEnded);
      audio.removeEventListener('error', handleError);
    };
  }, [audioRef, handleEnded, handleError, setPaused]);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
    }
  }, [volume, audioRef]);

  return { nextMusic };
};
