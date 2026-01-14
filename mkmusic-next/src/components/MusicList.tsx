import React, { useEffect, useRef } from 'react';
import { Music } from '../types';

interface MusicListProps {
  list: Music[];
  currentPlayId?: number;
  onItemClick: (index: number) => void;
  isSheet?: boolean;
}

declare global {
  interface JQuery {
    mCustomScrollbar(options?: any): JQuery;
  }
}

const MusicList: React.FC<MusicListProps> = ({ list, currentPlayId, onItemClick, isSheet }) => {
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

  return (
    <div className="music-list data-box" ref={listRef}>
      <div className="mCustomScrollBox">
        {list.map((item, index) => (
          <div
            key={`${item.id}-${index}`}
            className={`list-item ${currentPlayId === index ? 'list-playing' : ''}`}
            onClick={() => onItemClick(index)}
            data-no={index}
          >
            <span className="list-num">{index + 1}</span>
            <span className="music-name">{item.name}</span>
            <span className="music-artist">{item.artist}</span>
            <span className="music-album">{item.album}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MusicList;
