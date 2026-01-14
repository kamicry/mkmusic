import { useEffect, useRef } from 'react';
import { usePlayer } from '../contexts/PlayerContext';

export const useLyric = () => {
  const {
    audioRef,
    lyric,
    lastLyric,
    setLastLyric,
    paused
  } = usePlayer();

  const lyricAreaRef = useRef<HTMLUListElement>(null);

  // Scroll lyrics based on current time
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio || !lyric || typeof lyric !== 'object') return;

    const scrollLyric = () => {
      const currentTime = Math.floor(audio.currentTime);
      
      if (!lyric[currentTime] || lastLyric === currentTime) return;

      // Find the lyric line
      let lineIndex = 0;
      for (const time in lyric) {
        const timeNum = parseInt(time);
        if (timeNum === currentTime) break;
        lineIndex++;
      }

      setLastLyric(currentTime);

      // Update UI - highlight current line
      const lyricItems = document.querySelectorAll('.lrc-item');
      lyricItems.forEach(item => item.classList.remove('lplaying'));
      
      const currentItem = document.querySelector(`.lrc-item[data-no="${lineIndex}"]`) as HTMLElement;
      if (currentItem) {
        currentItem.classList.add('lplaying');
      }

      // Scroll to current line
      if (lyricAreaRef.current) {
        const scrollPosition = (lineIndex * 30) - (lyricAreaRef.current.clientHeight / 2);
        lyricAreaRef.current.scrollTo({ top: scrollPosition, behavior: 'smooth' });
      }
    };

    const interval = setInterval(scrollLyric, 500);
    
    return () => clearInterval(interval);
  }, [audioRef, lyric, lastLyric, setLastLyric, paused]);

  // Force refresh lyric at specific time
  const refreshLyric = (time: number) => {
    if (!lyric || typeof lyric !== 'object') return;

    const timeInt = Math.floor(time);
    
    if (!lyric[timeInt]) return;

    // Find the lyric line
    let lineIndex = 0;
    for (const t in lyric) {
      const timeNum = parseInt(t);
      if (timeNum >= timeInt) break;
      lineIndex++;
    }

    setLastLyric(timeInt);

    // Update UI
    const lyricItems = document.querySelectorAll('.lrc-item');
    lyricItems.forEach(item => item.classList.remove('lplaying'));
    
    const currentItem = document.querySelector(`.lrc-item[data-no="${lineIndex}"]`) as HTMLElement;
    if (currentItem) {
      currentItem.classList.add('lplaying');
    }

    // Scroll to current line
    if (lyricAreaRef.current) {
      const scrollPosition = (lineIndex * 30) - (lyricAreaRef.current.clientHeight / 2);
      lyricAreaRef.current.scrollTo({ top: scrollPosition, behavior: 'smooth' });
    }
  };

  // Display lyric tip
  const lyricTip = (str: string) => {
    if (lyricAreaRef.current) {
      lyricAreaRef.current.innerHTML = `<li class="lyric-tip">${str}</li>`;
    }
  };

  // Display lyrics
  const displayLyrics = () => {
    if (!lyric || typeof lyric !== 'object') return;

    if (lyricAreaRef.current) {
      lyricAreaRef.current.innerHTML = '';
      lyricAreaRef.current.scrollTop = 0;
      
      let i = 0;
      for (const time in lyric) {
        const txt = lyric[parseInt(time)] || '&nbsp;';
        const li = document.createElement('li');
        li.className = 'lrc-item';
        li.dataset.no = i.toString();
        li.textContent = txt;
        lyricAreaRef.current.appendChild(li);
        i++;
      }
    }
  };

  return {
    lyricAreaRef,
    refreshLyric,
    lyricTip,
    displayLyrics
  };
};