import React from 'react';
import { usePlayer } from '../contexts/PlayerContext';

const MusicList: React.FC = () => {
  const { musicList, dislist } = usePlayer();
  
  const currentList = musicList[dislist];
  
  if (!currentList) {
    return <div className="text-center py-8">加载中...</div>;
  }

  return (
    <div className="music-list-container">
      {/* List header */}
      <div className="list-header grid grid-cols-12 gap-4 py-2 px-4 bg-gray-700 text-sm font-bold">
        <div className="col-span-1">#</div>
        <div className="col-span-5">歌曲</div>
        <div className="col-span-3">歌手</div>
        <div className="col-span-3">专辑</div>
      </div>

      {/* List items */}
      <div className="list-items">
        {currentList.item.length === 0 ? (
          <div className="text-center py-8 text-gray-400">
            {dislist === 0 ? '搜索结果将显示在这里' : '列表为空'}
          </div>
        ) : (
          <div className="space-y-1">
            {currentList.item.map((item, index) => (
              <div 
                key={`${item.id}-${index}`}
                className="list-item grid grid-cols-12 gap-4 py-2 px-4 hover:bg-gray-700 cursor-pointer"
                data-no={index}
              >
                <div className="col-span-1 text-gray-400">{index + 1}</div>
                <div className="col-span-5 truncate">{item.name}</div>
                <div className="col-span-3 truncate text-gray-300">{item.artist}</div>
                <div className="col-span-3 truncate text-gray-300">{item.album}</div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MusicList;