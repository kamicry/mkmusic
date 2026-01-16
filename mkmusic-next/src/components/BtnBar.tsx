import React from 'react';
import { usePlayerContext } from '../contexts/PlayerContext';

interface BtnBarProps {
  onSearchClick: () => void;
  onShowList: (type: 'list' | 'sheet' | 'player') => void;
  activeView: 'list' | 'sheet' | 'player';
}

const BtnBar: React.FC<BtnBarProps> = ({ onSearchClick, onShowList, activeView }) => {
  const { dislist, setDislist, playHistory, clearPlayHistoryCtx } = usePlayerContext();

  const handleShowPlaying = () => {
    setDislist(1); // 正在播放列表在 index 1
    onShowList('list');
  };

  const handleShowPlayHistory = () => {
    setDislist(2); // 播放历史在 index 2
    onShowList('list');
  };

  const handleClearHistory = () => {
    if (window.confirm('确定要清空所有播放历史吗？')) {
      clearPlayHistoryCtx();
    }
  };

  return (
    <div className="btn-bar">
      <div className="btn-box" id="btn-area">
        <span 
          className={`btn ${activeView === 'player' ? 'active' : ''}`} 
          data-action="player" 
          onClick={() => onShowList('player')}
        >
          播放器
        </span>
        <span 
          className={`btn ${activeView === 'list' && dislist === 1 ? 'active' : ''}`} 
          data-action="playing" 
          title="正在播放列表" 
          onClick={handleShowPlaying}
        >
          正在播放
        </span>
        <span 
          className={`btn ${activeView === 'list' && dislist === 2 ? 'active' : ''}`} 
          data-action="history" 
          title="播放历史" 
          onClick={handleShowPlayHistory}
        >
          播放历史 ({playHistory.length})
        </span>
        <span 
          className={`btn ${activeView === 'sheet' ? 'active' : ''}`} 
          data-action="sheet" 
          title="音乐播放列表" 
          onClick={() => onShowList('sheet')}
        >
          播放列表
        </span>
        <span 
          className="btn" 
          data-action="search" 
          title="点击搜索音乐" 
          onClick={onSearchClick}
        >
          歌曲搜索
        </span>
        {dislist === 2 && playHistory.length > 0 && (
          <span 
            className="btn btn-clear-history" 
            data-action="clear-history" 
            title="清空播放历史" 
            onClick={handleClearHistory}
            style={{ marginLeft: '10px', color: '#ff4757' }}
          >
            清空历史
          </span>
        )}
      </div>
    </div>
  );
};

export default BtnBar;
