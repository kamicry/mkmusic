import React from 'react';
import BtnBar from './BtnBar';
import DataArea from './DataArea';
import Player from './Player';

const Center: React.FC = () => {
  return (
    <div className="center flex-1 flex flex-col md:flex-row">
      <div className="container flex-1 flex flex-col">
        {/* Button bar */}
        <BtnBar />

        {/* Data area */}
        <DataArea />
      </div>

      {/* Player area (cover and lyrics) */}
      <Player />
    </div>
  );
};

export default Center;