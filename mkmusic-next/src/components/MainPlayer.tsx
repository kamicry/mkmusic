import React from 'react';
import LyricPanel from './LyricPanel';
import { usePlayerContext } from '../contexts/PlayerContext';
import { useLayer } from '../hooks/useLayer';

interface MainPlayerProps {
  style?: React.CSSProperties;
}

const MainPlayer: React.FC<MainPlayerProps> = ({ style }) => {
  const { playlist, playid, musicList } = usePlayerContext();
  const { open } = useLayer();
  const currentMusic = playlist !== undefined ? musicList[playlist]?.item[playid] : null;

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
    <div className="player" id="player" style={style}>
      <div className="cover">
        <img src={currentMusic?.pic || 'images/player_cover.png'} className="music-cover" id="music-cover" alt="cover" />
      </div>
      <LyricPanel />
      <div className="music-info-display">
        {currentMusic ? `${currentMusic.name} - ${currentMusic.artist}` : ''}
      </div>
      <div id="music-info" title="点击查看歌曲信息" onClick={showMusicInfo}></div>
    </div>
  );
};

export default MainPlayer;
