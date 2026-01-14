import React from 'react';

interface DataAreaProps {
  children: React.ReactNode;
}

const DataArea: React.FC<DataAreaProps> = ({ children }) => {
  return (
    <div className="data-area">
      {children}
    </div>
  );
};

export default DataArea;
