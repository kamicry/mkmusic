import React, { useEffect, useState, useRef } from 'react';
import { usePlayerContext } from '../contexts/PlayerContext';
import { parseLyric, LyricLine, getLyricIndex } from '../utils/lyric';
import { ajaxLyric } from '../utils/api';

const LyricPanel: React.FC = () => {
  const { audioRef, playlist, playid, musicList } = usePlayerContext();
  const [lyrics, setLyrics] = useState<LyricLine[]>([]);
  const [currentIndex, setCurrentIndex] = useState(-1);
  const lyricRef = useRef<HTMLUListElement>(null);

  useEffect(() => {
    const music = playlist !== undefined ? musicList[playlist]?.item[playid] : null;
    if (music) {
      ajaxLyric(music).then((lrc) => {
        setLyrics(parseLyric(lrc));
        setCurrentIndex(-1);
      }).catch(() => {
        setLyrics([{ time: 0, text: '歌词加载失败' }]);
      });
    } else {
      setLyrics([]);
    }
  }, [playlist, playid, musicList]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const onTimeUpdate = () => {
      const index = getLyricIndex(lyrics, audio.currentTime);
      if (index !== currentIndex) {
        setCurrentIndex(index);
      }
    };

    audio.addEventListener('timeupdate', onTimeUpdate);
    return () => audio.removeEventListener('timeupdate', onTimeUpdate);
  }, [lyrics, currentIndex, audioRef]);

  useEffect(() => {
    if (lyricRef.current && currentIndex !== -1) {
      const activeItem = lyricRef.current.children[currentIndex] as HTMLElement;
      if (activeItem) {
        const containerHeight = lyricRef.current.parentElement?.clientHeight || 0;
        const offset = activeItem.offsetTop - containerHeight / 2 + activeItem.clientHeight / 2;
        lyricRef.current.style.transform = `translateY(${-offset}px)`;
      }
    } else if (lyricRef.current) {
        lyricRef.current.style.transform = `translateY(0)`;
    }
  }, [currentIndex]);

  return (
    <div className="lyric">
      <ul id="lyric" ref={lyricRef} style={{ transition: 'transform 0.3s ease-out' }}>
        {lyrics.length > 0 ? (
          lyrics.map((line, index) => (
            <li key={index} className={index === currentIndex ? 'lyric-next' : ''}>
              {line.text}
            </li>
          ))
        ) : (
          <li>{playlist === undefined ? 'MKOnlinePlayer' : '没有歌词'}</li>
        )}
      </ul>
    </div>
  );
};

export default LyricPanel;
