import React from 'react';
import ProgressBar from './ProgressBar';

const Footer: React.FC = () => {
  return (
    <div className="footer bg-gray-800 py-4 px-6">
      <div className="container mx-auto">
        {/* Control buttons */}
        <div className="con-btn flex items-center justify-center space-x-6 mb-4">
          <a href="#" className="player-btn btn-prev w-8 h-8" title="上一首"></a>
          <a href="#" className="player-btn btn-play w-10 h-10" title="暂停/继续"></a>
          <a href="#" className="player-btn btn-next w-8 h-8" title="下一首"></a>
          <a href="#" className="player-btn btn-order w-8 h-8" title="循环控制"></a>
        </div>

        {/* Volume control */}
        <div className="vol flex items-center justify-center space-x-4 mb-4">
          <div className="quiet">
            <a href="#" className="player-btn btn-quiet w-6 h-6" title="静音"></a>
          </div>
          <div className="volume flex-1 max-w-xs">
            <div className="volume-box">
              <ProgressBar id="volume-progress" className="mkpgb-area h-1" />
            </div>
          </div>
        </div>

        {/* Progress bar */}
        <div className="progress">
          <div className="progress-box">
            <ProgressBar id="music-progress" className="mkpgb-area h-1" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Footer;