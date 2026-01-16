import React, { useEffect, useRef } from 'react';
import { Music } from '../types';
import { usePlayerContext } from '../contexts/PlayerContext';
import { removePlayHistoryItem } from '../utils/storage';

interface MusicListProps {
  list: Music[];
  currentPlayId?: number;
  onItemClick: (index: number) => void;
  onInfoClick?: (index: number) => void;
  isSheet?: boolean;
  dislist?: number; // Add dislist prop to identify play history
}

declare global {
  interface JQuery {
    mCustomScrollbar(options?: any): JQuery;
  }
}

const MusicList: React.FC<MusicListProps> = ({ list, currentPlayId, onItemClick, onInfoClick, isSheet, dislist }) => {
  const listRef = useRef<HTMLDivElement>(null);
  const { setPlayHistory, playHistory } = usePlayerContext();

  useEffect(() => {
    if (typeof window !== 'undefined' && (window as any).$ && listRef.current) {
      const $ = (window as any).$;
      $(listRef.current).mCustomScrollbar({
        theme: "minimal",
        advanced: {
          updateOnContentResize: true
        }
      });
    }
  }, []);

  const handleInfoClick = (e: React.MouseEvent, index: number) => {
    e.stopPropagation(); // Prevent triggering play
    if (onInfoClick) {
      onInfoClick(index);
    }
  };

  const handleDeleteHistoryItem = (e: React.MouseEvent, index: number) => {
    e.stopPropagation(); // Prevent triggering play
    const music = list[index];
    if (music && window.confirm(`确定要从播放历史中删除"${music.name}"吗？`)) {
      // Remove from play history
      removePlayHistoryItem(music.id, music.source);
      // Update play history state
      const updatedHistory = playHistory.filter(item => 
        !(item.id === music.id && item.source === music.source)
      );
      setPlayHistory(updatedHistory);
    }
  };

  return (
    <div className="music-list data-box" ref={listRef}>
      <div className="mCustomScrollBox">
        {list.map((item, index) => (
          <div
            key={`${item.id}-${index}`}
            className={`list-item ${currentPlayId === index ? 'list-playing' : ''}`}
            data-no={index}
          >
            <span className="list-num" onClick={() => onItemClick(index)}>{index + 1}</span>
            <span className="music-name" onClick={() => onItemClick(index)} title={item.name}>{item.name}</span>
            <span className="music-artist" onClick={() => onItemClick(index)} title={item.artist}>{item.artist}</span>
            <span className="music-album" onClick={() => onItemClick(index)} title={item.album}>{item.album}</span>
            {onInfoClick && (
              <span
                className="music-info-btn"
                onClick={(e) => handleInfoClick(e, index)}
                title="查看详情"
              >
                ℹ️
              </span>
            )}
            {dislist === 2 && (
              <span
                className="music-delete-btn"
                onClick={(e) => handleDeleteHistoryItem(e, index)}
                title="从播放历史中删除"
                style={{ 
                  cursor: 'pointer', 
                  color: '#ff4757', 
                  marginLeft: '8px',
                  fontSize: '14px',
                  fontWeight: 'bold'
                }}
              >
                ×
              </span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default MusicList;
