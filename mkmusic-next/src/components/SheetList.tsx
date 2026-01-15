import React from 'react';
import { usePlayerContext } from '../contexts/PlayerContext';

const SheetList: React.FC = () => {
  const { musicList } = usePlayerContext();

  // Filter out system playlists (search results, playing, history)
  const customPlaylists = musicList.slice(3);

  return (
    <div className="sheet-list-container">
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {customPlaylists.map((playlist, index) => (
          <div 
            key={`sheet-${index}`}
            className="sheet-item p-4 bg-gray-700 rounded cursor-pointer hover:bg-gray-600"
            data-no={index + 3}
          >
            <div className="sheet-cover mb-2">
              <img 
                src={playlist.cover || '/images/player_cover.png'}
                alt={playlist.name}
                className="w-full aspect-square object-cover rounded"
              />
            </div>
            <div className="sheet-name text-sm truncate">{playlist.name}</div>
            {playlist.creatorName && (
              <div className="sheet-creator text-xs text-gray-400 truncate">
                {playlist.creatorName}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default SheetList;