import React, { useState } from 'react';
import BtnBar from './BtnBar';
import DataArea from './DataArea';
import Player from './Player';

type ViewType = 'list' | 'sheet' | 'player';

const Center: React.FC = () => {
  const [activeView, setActiveView] = useState<ViewType>('list');

  const handleShowList = (type: ViewType) => {
    setActiveView(type);
  };

  const handleSearchClick = () => {
    // 搜索功能由外部处理，这里可以添加搜索事件
    console.log('Search clicked');
  };

  return (
    <div className="center flex-1 flex flex-col md:flex-row">
      <div className="container flex-1 flex flex-col">
        {/* Button bar */}
        <BtnBar 
          activeView={activeView}
          onShowList={handleShowList}
          onSearchClick={handleSearchClick}
        />

        {/* Data area */}
        <DataArea>
          <div className="data-content">
            {/* Data area content will be rendered here */}
          </div>
        </DataArea>
      </div>

      {/* Player area (cover and lyrics) */}
      <Player />
    </div>
  );
};

export default Center;
