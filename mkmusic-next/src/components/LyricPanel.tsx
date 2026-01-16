import React, { useEffect, useState, useRef } from 'react';
import { usePlayerContext } from '../contexts/PlayerContext';
import { parseLyric, LyricLine, getLyricIndex } from '../utils/lyric';
import { ajaxLyric } from '../utils/api';

const LyricPanel: React.FC = () => {
  const { 
    audioRef, 
    playlist, 
    playid, 
    musicList,
    showTranslation,
    originalLyrics,
    translatedLyrics,
    hasTranslation,
    setShowTranslation,
    setOriginalLyrics,
    setTranslatedLyrics,
    setHasTranslation
  } = usePlayerContext();
  
  const [currentIndex, setCurrentIndex] = useState(-1);
  const lyricRef = useRef<HTMLUListElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  // 获取歌词数据（原歌词和翻译歌词）
  useEffect(() => {
    const music = playlist !== undefined ? musicList[playlist]?.item[playid] : null;
    if (music) {
      ajaxLyric(music).then((result) => {
        // 解析原歌词
        const original = parseLyric(result.lyric || '');
        setOriginalLyrics(original);
        
        // 解析翻译歌词（如果存在）
        const translated = result.tlyric ? parseLyric(result.tlyric) : [];
        setTranslatedLyrics(translated);
        
        // 设置是否有翻译
        const hasTrans = !!(result.tlyric && result.tlyric.trim().length > 0);
        setHasTranslation(hasTrans);
        
        // 重置显示状态
        setShowTranslation(false);
        setCurrentIndex(-1);
      }).catch(() => {
        setOriginalLyrics([{ time: 0, text: '歌词加载失败' }]);
        setTranslatedLyrics([]);
        setHasTranslation(false);
        setShowTranslation(false);
      });
    } else {
      setOriginalLyrics([]);
      setTranslatedLyrics([]);
      setHasTranslation(false);
      setShowTranslation(false);
    }
  }, [playlist, playid, musicList, setOriginalLyrics, setTranslatedLyrics, setHasTranslation, setShowTranslation]);

  // 获取当前显示的歌词
  const currentLyrics = showTranslation ? translatedLyrics : originalLyrics;

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const onTimeUpdate = () => {
      const index = getLyricIndex(currentLyrics, audio.currentTime);
      if (index !== currentIndex) {
        setCurrentIndex(index);
      }
    };

    audio.addEventListener('timeupdate', onTimeUpdate);
    return () => audio.removeEventListener('timeupdate', onTimeUpdate);
  }, [currentLyrics, currentIndex, audioRef]);

  useEffect(() => {
    if (scrollContainerRef.current && lyricRef.current && currentIndex !== -1) {
      const activeItem = lyricRef.current.children[currentIndex] as HTMLElement;
      const container = scrollContainerRef.current;
      if (activeItem && container) {
        const containerHeight = container.clientHeight;
        const activeItemTop = activeItem.offsetTop;
        const activeItemHeight = activeItem.clientHeight;
        
        // 计算滚动位置，使当前行居中
        const scrollTop = activeItemTop - (containerHeight / 2) + (activeItemHeight / 2);
        
        // 边界检查
        const maxScrollTop = lyricRef.current.clientHeight - containerHeight;
        const targetScrollTop = Math.max(0, Math.min(scrollTop, maxScrollTop));
        
        container.scrollTo({
          top: targetScrollTop,
          behavior: 'smooth'
        });
      }
    } else if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [currentIndex]);

  const handleToggleTranslation = (show: boolean) => {
    setShowTranslation(show);
  };

  return (
    <div className="lyric">
      {/* 歌词切换按钮 */}
      {hasTranslation && (
        <div className="lyric-toggle">
          <button
            className={`toggle-btn ${!showTranslation ? 'active' : ''}`}
            onClick={() => handleToggleTranslation(false)}
          >
            原歌词
          </button>
          <button
            className={`toggle-btn ${showTranslation ? 'active' : ''}`}
            onClick={() => handleToggleTranslation(true)}
          >
            翻译歌词
          </button>
        </div>
      )}
      
      {/* 歌词滚动容器 */}
      <div className="lyric-scroll-container" ref={scrollContainerRef}>
        <ul id="lyric" ref={lyricRef} style={{ transition: 'transform 0.3s ease-out' }}>
          {currentLyrics.length > 0 ? (
            currentLyrics.map((line, index) => (
              <li key={index} className={index === currentIndex ? 'lyric-next' : ''}>
                {line.text}
              </li>
            ))
          ) : (
            <li>{playlist === undefined ? 'MKOnlinePlayer' : '没有歌词'}</li>
          )}
        </ul>
      </div>
    </div>
  );
};

export default LyricPanel;
