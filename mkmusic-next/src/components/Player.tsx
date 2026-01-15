import React from 'react';
import { usePlayerContext } from '../contexts/PlayerContext';
import { useLayer } from '../hooks/useLayer';

const Player: React.FC = () => {
  const { musicList, playlist, playid } = usePlayerContext();
  const { open } = useLayer();
  
  // Get current music info
  const currentMusic = playlist !== undefined && playid !== undefined 
    ? musicList[playlist]?.item[playid] 
    : null;

  const showMusicInfo = () => {
    if (!currentMusic) return;
    const tempStr = `<span class="info-title">歌名：</span>${currentMusic.name}<br><span class="info-title">歌手：</span>${currentMusic.artist}<br><span class="info-title">专辑：</span>${currentMusic.album}`;
    open({
        type: 0,
        shade: false,
        title: false,
        btn: false,
        content: tempStr
    });
  };

  return (
    <div className="player w-full md:w-80 lg:w-96 bg-gray-800 p-4" id="player">
      {/* Music cover */}
      <div className="cover mb-4">
        <img 
          src={currentMusic?.pic || "/images/player_cover.png"}
          className="music-cover w-full aspect-square object-cover rounded"
          id="music-cover"
          alt="Music cover"
        />
      </div>

      {/* Lyrics area */}
      <div className="lyric h-64 overflow-y-auto">
        <ul id="lyric" className="text-center text-sm space-y-2"></ul>
      </div>

      {/* Music info */}
      <div className="music-info-display">
        {currentMusic ? `${currentMusic.name} - ${currentMusic.artist}` : '没有正在播放的歌曲'}
      </div>
      <div 
        id="music-info" 
        title="点击查看歌曲信息"
        onClick={showMusicInfo}
      ></div>
    </div>
  );
};

export default Player;