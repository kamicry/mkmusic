import React, { useEffect, useState, useRef } from 'react';
import { usePlayerContext } from '../contexts/PlayerContext';
import { useAudio } from '../hooks/useAudio';
import { useLayer } from '../hooks/useLayer';

const Footer: React.FC = () => {
  const {
    audioRef,
    paused,
    setPaused,
    order,
    setOrder,
    volume,
    setVolume,
    playid,
    playlist,
    musicList,
    setPlayid
  } = usePlayerContext();
  const { nextMusic } = useAudio();
  const { msg } = useLayer();
  const [progress, setProgress] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  const prevMusic = () => {
    const currentList = musicList[1]?.item;
    if (!currentList || currentList.length === 0) return;
    setPlayid((playid - 1 + currentList.length) % currentList.length);
  };

  const togglePlay = () => {
    if (audioRef.current) {
      if (paused) {
        audioRef.current.play();
      } else {
        audioRef.current.pause();
      }
    }
  };

  const changeOrder = () => {
    let newOrder: 1 | 2 | 3;
    if (order === 1) {
      newOrder = 2;
      msg('列表循环');
    } else if (order === 2) {
      newOrder = 3;
      msg('随机播放');
    } else {
      newOrder = 1;
      msg('单曲循环');
    }
    setOrder(newOrder);
  };

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const onTimeUpdate = () => {
      setCurrentTime(audio.currentTime);
      setDuration(audio.duration);
      if (audio.duration) {
        setProgress(audio.currentTime / audio.duration);
      }
    };

    audio.addEventListener('timeupdate', onTimeUpdate);
    return () => audio.removeEventListener('timeupdate', onTimeUpdate);
  }, [audioRef]);

  const handleProgressClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!audioRef.current || !audioRef.current.duration) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const pct = x / rect.width;
    audioRef.current.currentTime = pct * audioRef.current.duration;
  };

  const handleVolumeClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const vol = Math.max(0, Math.min(1, x / rect.width));
    setVolume(vol);
    localStorage.setItem('player_volume', vol.toString());
  };

  const currentMusic = playlist !== undefined ? musicList[playlist]?.item[playid] : null;

  return (
    <div className="footer">
      <div className="container">
        <div className="con-btn">
          <a href="javascript:;" className="player-btn btn-prev" title="上一首" onClick={prevMusic}></a>
          <a href="javascript:;" className={`player-btn btn-play ${!paused ? 'btn-state-paused' : ''}`} title="暂停/继续" onClick={togglePlay}></a>
          <a href="javascript:;" className="player-btn btn-next" title="下一首" onClick={nextMusic}></a>
          <a href="javascript:;" className={`player-btn btn-order ${order === 1 ? 'btn-order-single' : order === 2 ? 'btn-order-list' : 'btn-order-random'}`} title="循环控制" onClick={changeOrder}></a>
        </div>
        
        <div className="vol">
          <div className="quiet">
            <a href="javascript:;" className={`player-btn btn-quiet ${volume === 0 ? 'btn-state-quiet' : ''}`} title="静音" onClick={() => setVolume(volume === 0 ? 0.6 : 0)}></a>
          </div>
          <div className="volume">
            <div className="volume-box" onClick={handleVolumeClick}>
              <div className="mkpgb-area">
                <div className="mkpgb-bar"></div>
                <div className="mkpgb-cur" style={{ width: `${volume * 100}%` }}></div>
                <div className="mkpgb-dot" style={{ left: `${volume * 100}%` }}></div>
              </div>
            </div>
          </div>
        </div>

        <div className="progress">
          <div className="progress-box" onClick={handleProgressClick}>
            <div className="mkpgb-area">
              <div className="mkpgb-bar"></div>
              <div className="mkpgb-cur" style={{ width: `${progress * 100}%` }}></div>
              <div className="mkpgb-dot" style={{ left: `${progress * 100}%` }}></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Footer;
