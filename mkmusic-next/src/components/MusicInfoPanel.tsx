import React, { useState, useEffect } from 'react';
import { Music } from '../types';
import { ajaxUrl, ajaxPic } from '../utils/api';
import { usePlayerContext } from '../contexts/PlayerContext';
import { API_CONFIG } from '../config/api.config';

interface MusicInfoPanelProps {
  music: Music;
  onClose: () => void;
}

const MusicInfoPanel: React.FC<MusicInfoPanelProps> = ({ music, onClose }) => {
  const { bitRate } = usePlayerContext();
  const [musicUrl, setMusicUrl] = useState<string>('加载中...');
  const [actualBitRate, setActualBitRate] = useState<number>(0);
  const [fileSize, setFileSize] = useState<number>(0);
  const [picUrl, setPicUrl] = useState<string>('加载中...');
  const [lyricUrl, setLyricUrl] = useState<string>('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMusicInfo = async () => {
      setLoading(true);
      
      try {
        // Fetch music URL
        const urlResult = await ajaxUrl(music, bitRate);
        setMusicUrl(urlResult.url || '无法获取');
        setActualBitRate(urlResult.br || 0);
        setFileSize(urlResult.size || 0);

        // Fetch album cover
        const picResult = await ajaxPic(music);
        setPicUrl(picResult || '无法获取');

        // Build lyric URL
        const lyricApiUrl = `${API_CONFIG.baseUrl}?types=lyric&id=${music.lyric_id}&source=${music.source}`;
        setLyricUrl(lyricApiUrl);
      } catch (error) {
        console.error('Failed to fetch music info:', error);
        setMusicUrl('获取失败');
        setPicUrl('获取失败');
      } finally {
        setLoading(false);
      }
    };

    fetchMusicInfo();
  }, [music, bitRate]);

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '未知';
    const mb = bytes / (1024 * 1024);
    return `${mb.toFixed(2)} MB`;
  };

  const fallbackCopyToClipboard = (text: string): boolean => {
    const textarea = document.createElement('textarea');
    textarea.value = text;
    textarea.setAttribute('readonly', '');
    textarea.style.position = 'fixed';
    textarea.style.left = '-9999px';
    textarea.style.top = '0';

    document.body.appendChild(textarea);
    textarea.focus();
    textarea.select();

    try {
      return document.execCommand('copy');
    } finally {
      document.body.removeChild(textarea);
    }
  };

  const copyToClipboard = async (text: string, label: string) => {
    try {
      if (navigator.clipboard?.writeText && window.isSecureContext) {
        await navigator.clipboard.writeText(text);
      } else if (!fallbackCopyToClipboard(text)) {
        throw new Error('Fallback copy failed');
      }
      alert(`${label}已复制到剪贴板`);
    } catch {
      alert('复制失败，请手动复制');
    }
  };

  return (
    <div 
      className="layer-anim layui-layer layui-layer-page music-info-modal"
      style={{ 
        zIndex: 19891016, 
        width: '90%',
        maxWidth: '600px',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        position: 'fixed',
        maxHeight: '80vh',
        overflow: 'auto'
      }}
    >
      <div className="layui-layer-title" style={{ cursor: 'move' }}>
        歌曲详细信息
      </div>
      <div className="layui-layer-content" style={{ padding: '20px' }}>
        <div className="music-info-content">
          {loading ? (
            <div className="loading-state">加载中...</div>
          ) : (
            <>
              <div className="info-section">
                <h3>🎵 基本信息</h3>
                <div className="info-row">
                  <span className="info-label">歌曲名称：</span>
                  <span className="info-value">{music.name}</span>
                </div>
                <div className="info-row">
                  <span className="info-label">艺术家：</span>
                  <span className="info-value">{music.artist}</span>
                </div>
                <div className="info-row">
                  <span className="info-label">专辑：</span>
                  <span className="info-value">{music.album}</span>
                </div>
                <div className="info-row">
                  <span className="info-label">音乐源：</span>
                  <span className="info-value">
                    {API_CONFIG.sourceLabels[music.source as keyof typeof API_CONFIG.sourceLabels] || music.source}
                  </span>
                </div>
                <div className="info-row">
                  <span className="info-label">歌曲ID：</span>
                  <span className="info-value">{music.id}</span>
                </div>
              </div>

              <div className="info-section">
                <h3>🎼 音频信息</h3>
                <div className="info-row">
                  <span className="info-label">请求码率：</span>
                  <span className="info-value">{bitRate}kbps</span>
                </div>
                <div className="info-row">
                  <span className="info-label">实际码率：</span>
                  <span className="info-value">{actualBitRate}kbps</span>
                </div>
                <div className="info-row">
                  <span className="info-label">文件大小：</span>
                  <span className="info-value">{formatFileSize(fileSize)}</span>
                </div>
              </div>

              <div className="info-section">
                <h3>🔗 资源链接</h3>
                <div className="info-row">
                  <span className="info-label">音乐链接：</span>
                  <div className="info-value-link">
                    <input 
                      type="text" 
                      value={musicUrl} 
                      readOnly 
                      className="link-input"
                      onClick={(e) => e.currentTarget.select()}
                    />
                    <button 
                      onClick={() => copyToClipboard(musicUrl, '音乐链接')}
                      className="copy-btn"
                      disabled={musicUrl === '加载中...' || musicUrl === '获取失败' || musicUrl === '无法获取'}
                    >
                      复制
                    </button>
                  </div>
                </div>
                <div className="info-row">
                  <span className="info-label">封面链接：</span>
                  <div className="info-value-link">
                    <input 
                      type="text" 
                      value={picUrl} 
                      readOnly 
                      className="link-input"
                      onClick={(e) => e.currentTarget.select()}
                    />
                    <button 
                      onClick={() => copyToClipboard(picUrl, '封面链接')}
                      className="copy-btn"
                      disabled={picUrl === '加载中...' || picUrl === '获取失败' || picUrl === '无法获取'}
                    >
                      复制
                    </button>
                  </div>
                </div>
                <div className="info-row">
                  <span className="info-label">歌词API：</span>
                  <div className="info-value-link">
                    <input 
                      type="text" 
                      value={lyricUrl} 
                      readOnly 
                      className="link-input"
                      onClick={(e) => e.currentTarget.select()}
                    />
                    <button 
                      onClick={() => copyToClipboard(lyricUrl, '歌词链接')}
                      className="copy-btn"
                    >
                      复制
                    </button>
                  </div>
                </div>
              </div>

              {music.pic && (
                <div className="info-section">
                  <h3>📷 专辑封面预览</h3>
                  <div className="cover-preview">
                    <img src={music.pic} alt={music.name} />
                  </div>
                </div>
              )}

              <div className="info-section">
                <h3>ℹ️ 说明</h3>
                <ul className="info-notes">
                  <li>音乐链接有时效性，过期后需要重新获取</li>
                  <li>实际码率可能与请求码率不同，取决于音源可用性</li>
                  <li>所有链接均来自 GD Studio API</li>
                </ul>
              </div>
            </>
          )}
        </div>
      </div>
      <span className="layui-layer-setwin">
        <a 
          className="layui-layer-ico layui-layer-close layui-layer-close1" 
          href="javascript:;" 
          onClick={onClose}
        ></a>
      </span>
    </div>
  );
};

export default MusicInfoPanel;
