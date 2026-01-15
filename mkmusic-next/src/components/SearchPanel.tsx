import React, { useState } from 'react';
import { usePlayerContext } from '../contexts/PlayerContext';
import { API_CONFIG, MusicSource, BitRate } from '../config/api.config';

interface SearchPanelProps {
  onSearch: (wd: string, source: string, page?: number) => void;
  onClose: () => void;
}

const SearchPanel: React.FC<SearchPanelProps> = ({ onSearch, onClose }) => {
  const { 
    wd: initialWd, 
    source: initialSource,
    bitRate: initialBitRate,
    currentPage,
    totalPages,
    setBitRate,
    setCurrentPage
  } = usePlayerContext();
  
  const [wd, setWd] = useState(initialWd);
  const [source, setSource] = useState<string>(initialSource);
  const [localBitRate, setLocalBitRate] = useState<BitRate>(initialBitRate);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!wd.trim()) return;
    
    // Update global bit rate
    setBitRate(localBitRate);
    
    // Reset to page 1 for new search
    setCurrentPage(1);
    onSearch(wd, source, 1);
    onClose();
  };
  
  const handlePageJump = (page: number) => {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
    onSearch(wd, source, page);
  };

  return (
    <div className="search-box">
      <form onSubmit={handleSubmit}>
        <div id="search-area">
          <div className="search-group">
            <input
              type="text"
              name="wd"
              id="search-wd"
              placeholder="搜索歌手、歌名、专辑"
              value={wd}
              onChange={(e) => setWd(e.target.value)}
              autoFocus
              required
            />
            <button className="search-submit" type="submit">搜 索</button>
          </div>
          
          <div className="radio-group" id="music-source">
            <label>音乐源：</label>
            {API_CONFIG.sources.map((s) => (
              <label key={s}>
                <input
                  type="radio"
                  name="source"
                  value={s}
                  checked={source === s}
                  onChange={() => setSource(s)}
                />{' '}
                {API_CONFIG.sourceLabels[s]}
              </label>
            ))}
          </div>
          
          <div className="select-group" id="bit-rate-select">
            <label htmlFor="bitrate">码率：</label>
            <select 
              id="bitrate"
              value={localBitRate} 
              onChange={(e) => setLocalBitRate(Number(e.target.value) as BitRate)}
            >
              {API_CONFIG.bitRates.map((br) => (
                <option key={br} value={br}>
                  {API_CONFIG.bitRateLabels[br]}
                </option>
              ))}
            </select>
          </div>
          
          {wd && totalPages > 1 && (
            <div className="pagination-controls">
              <label>页码跳转：</label>
              <button 
                type="button"
                onClick={() => handlePageJump(currentPage - 1)} 
                disabled={currentPage === 1}
              >
                上一页
              </button>
              
              <select 
                value={currentPage} 
                onChange={(e) => handlePageJump(Number(e.target.value))}
              >
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                  <option key={page} value={page}>
                    第 {page} 页
                  </option>
                ))}
              </select>
              
              <span className="page-info">
                第 {currentPage} 页 / 共 {totalPages} 页
              </span>
              
              <button 
                type="button"
                onClick={() => handlePageJump(currentPage + 1)} 
                disabled={currentPage === totalPages}
              >
                下一页
              </button>
            </div>
          )}
          
          <div className="api-credit">
            <small>
              音乐源由 <a href="https://music.gdstudio.xyz" target="_blank" rel="noopener noreferrer">GD音乐台</a> 提供
            </small>
          </div>
        </div>
      </form>
    </div>
  );
};

export default SearchPanel;
