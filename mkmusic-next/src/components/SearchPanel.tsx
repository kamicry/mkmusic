import React, { useState } from 'react';
import { usePlayerContext } from '../contexts/PlayerContext';

interface SearchPanelProps {
  onSearch: (wd: string, source: string) => void;
  onClose: () => void;
}

const SearchPanel: React.FC<SearchPanelProps> = ({ onSearch, onClose }) => {
  const { wd: initialWd, source: initialSource } = usePlayerContext();
  const [wd, setWd] = useState(initialWd);
  const [source, setSource] = useState(initialSource);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!wd.trim()) return;
    onSearch(wd, source);
    onClose();
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
            {[
              { val: 'netease', label: '网易云' },
              { val: 'tencent', label: 'QQ' },
              { val: 'xiami', label: '虾米' },
              { val: 'kugou', label: '酷狗' },
              { val: 'baidu', label: '百度' },
            ].map((s) => (
              <label key={s.val}>
                <input
                  type="radio"
                  name="source"
                  value={s.val}
                  checked={source === s.val}
                  onChange={() => setSource(s.val)}
                />{' '}
                {s.label}
              </label>
            ))}
          </div>
        </div>
      </form>
    </div>
  );
};

export default SearchPanel;
