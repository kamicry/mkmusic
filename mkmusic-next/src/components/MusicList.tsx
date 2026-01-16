import React, { useEffect, useRef } from 'react';
import { Music } from '../types';

interface MusicListProps {
  list: Music[];
  currentPlayId?: number;
  onItemClick: (index: number) => void;
  onInfoClick?: (index: number) => void;
  isSheet?: boolean;
}

declare global {
  interface JQuery {
    mCustomScrollbar(options?: any): JQuery;
  }
}

const MusicList: React.FC<MusicListProps> = ({ list, currentPlayId, onItemClick, onInfoClick, isSheet }) => {
  const listRef = useRef<HTMLDivElement>(null);

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
          </div>
        ))}
      </div>
    </div>
  );
};

export default MusicList;
