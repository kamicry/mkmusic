import React from 'react';

const BtnBar: React.FC = () => {
  return (
    <div className="btn-bar py-4 px-6">
      <div className="btn-box flex space-x-4" id="btn-area">
        <span className="btn hidden" data-action="player">播放器</span>
        <span className="btn" data-action="playing" title="正在播放列表">正在播放</span>
        <span className="btn" data-action="sheet" title="音乐播放列表">播放列表</span>
        <span className="btn" data-action="search" title="点击搜索音乐">歌曲搜索</span>
      </div>
    </div>
  );
};

export default BtnBar;