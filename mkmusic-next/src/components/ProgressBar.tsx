import React, { useState, useRef, useEffect } from 'react';

interface ProgressBarProps {
  id: string;
  className?: string;
  initialValue?: number;
  onChange?: (value: number) => void;
  locked?: boolean;
}

const ProgressBar: React.FC<ProgressBarProps> = ({ 
  id, 
  className = '', 
  initialValue = 0, 
  onChange, 
  locked = false 
}) => {
  const [value, setValue] = useState<number>(initialValue);
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const progressBarRef = useRef<HTMLDivElement>(null);

  const handleMouseDown = (e: React.MouseEvent) => {
    if (locked) return;
    setIsDragging(true);
    updateProgress(e);
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (!isDragging || locked) return;
    updateProgress(e);
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const updateProgress = (e: React.MouseEvent | MouseEvent) => {
    if (!progressBarRef.current) return;
    
    const rect = progressBarRef.current.getBoundingClientRect();
    const offsetX = e.clientX - rect.left;
    const width = rect.width;
    const newValue = Math.max(0, Math.min(1, offsetX / width));
    
    setValue(newValue);
    if (onChange) {
      onChange(newValue);
    }
  };

  useEffect(() => {
    if (isDragging) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
    } else {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    }
    
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging]);

  return (
    <div
      id={id}
      ref={progressBarRef}
      className={`progress-bar relative w-full bg-gray-600 rounded-full cursor-pointer ${className} ${locked ? 'mkpgb-locked' : ''}`}
      onMouseDown={handleMouseDown}
    >
      <div 
        className="mkpgb-bar absolute top-0 left-0 h-full bg-gray-400 rounded-full"
        style={{ width: `${value * 100}%` }}
      ></div>
      <div 
        className="mkpgb-cur absolute top-0 left-0 h-full bg-green-500 rounded-full"
        style={{ width: `${value * 100}%` }}
      ></div>
      <div 
        className="mkpgb-dot absolute top-1/2 -translate-y-1/2 w-3 h-3 bg-white rounded-full"
        style={{ left: `${value * 100}%` }}
      ></div>
    </div>
  );
};

export default ProgressBar;