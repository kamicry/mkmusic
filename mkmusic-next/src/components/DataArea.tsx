import React from 'react';
import MusicList from './MusicList';
import SheetList from './SheetList';

const DataArea: React.FC = () => {
  return (
    <div className="data-area flex-1 px-6 pb-6">
      {/* Sheet list (playlists) */}
      <div id="sheet" className="data-box hidden">
        <SheetList />
      </div>

      {/* Main music list */}
      <div id="main-list" className="music-list data-box">
        <MusicList />
      </div>
    </div>
  );
};

export default DataArea;