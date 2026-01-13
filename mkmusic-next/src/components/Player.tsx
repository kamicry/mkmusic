import React from 'react';
import { usePlayer } from '../contexts/PlayerContext';

const Player: React.FC = () => {
  const { musicList, playlist, playid } = usePlayer();
  
  // Get current music info
  const currentMusic = playlist !== undefined && playid !== undefined 
    ? musicList[playlist]?.item[playid] 
    : null;

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
      <div 
        id="music-info" 
        title="点击查看歌曲信息"
        className="mt-4 p-2 bg-gray-700 rounded text-center cursor-pointer"
      >
        {currentMusic ? `${currentMusic.name} - ${currentMusic.artist}` : '没有正在播放的歌曲'}
      </div>
    </div>
  );
};

export default Player;