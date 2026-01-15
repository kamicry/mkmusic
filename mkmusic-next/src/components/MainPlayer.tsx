import React from 'react';
import LyricPanel from './LyricPanel';
import { usePlayerContext } from '../contexts/PlayerContext';

interface MainPlayerProps {
  style?: React.CSSProperties;
}

const MainPlayer: React.FC<MainPlayerProps> = ({ style }) => {
  const { playlist, playid, musicList } = usePlayerContext();
  const currentMusic = playlist !== undefined ? musicList[playlist]?.item[playid] : null;

  return (
    <div className="player" id="player" style={style}>
      <div className="cover">
        <img src={currentMusic?.pic || 'images/player_cover.png'} className="music-cover" id="music-cover" alt="cover" />
      </div>
      <LyricPanel />
      <div id="music-info">{currentMusic ? `${currentMusic.name} - ${currentMusic.artist}` : ''}</div>
    </div>
  );
};

export default MainPlayer;
