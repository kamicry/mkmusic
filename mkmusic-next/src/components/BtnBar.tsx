import React from 'react';
import { usePlayerContext } from '../contexts/PlayerContext';

interface BtnBarProps {
  onSearchClick: () => void;
  onShowList: (type: 'playing' | 'sheet' | 'player') => void;
}

const BtnBar: React.FC<BtnBarProps> = ({ onSearchClick, onShowList }) => {
  return (
    <div className="btn-bar">
      <div className="btn-box" id="btn-area">
        <span className="btn" data-action="player" onClick={() => onShowList('player')}>播放器</span>
        <span className="btn" data-action="playing" title="正在播放列表" onClick={() => onShowList('playing')}>正在播放</span>
        <span className="btn" data-action="sheet" title="音乐播放列表" onClick={() => onShowList('sheet')}>播放列表</span>
        <span className="btn" data-action="search" title="点击搜索音乐" onClick={onSearchClick}>歌曲搜索</span>
      </div>
    </div>
  );
};

export default BtnBar;
