import React, { useState, useEffect } from 'react';
import { Music } from '../types';
import { API_CONFIG, BitRate } from '../config/api.config';
import { ajaxUrl, ajaxPic } from '../utils/api';

interface SongInfo {
  id: string;
  name: string;
  artist: string;
  album: string;
  source: string;
  songUrl: string;
  coverUrl: string;
  lyricUrl: string;
  bitRate: number; // 改为 number 类型以匹配 API 返回类型
}

interface SongInfoModalProps {
  music: Music;
  isOpen: boolean;
  onClose: () => void;
  bitRate: BitRate;
}

const SongInfoModal: React.FC<SongInfoModalProps> = ({
  music,
  isOpen,
  onClose,
  bitRate
}) => {
  const [songInfo, setSongInfo] = useState<SongInfo | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // 键盘导航支持
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown);
      // 防止背景滚动
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'auto';
    };
  }, [isOpen, onClose]);

  useEffect(() => {
    if (isOpen && music) {
      loadSongInfo();
    }
  }, [isOpen, music, bitRate]);

  const loadSongInfo = async () => {
    if (!music) return;
    
    setLoading(true);
    setError(null);
    
    try {
      // 获取歌曲 URL
      const songUrlData = await ajaxUrl(music, bitRate);
      
      // 获取封面 URL
      const coverUrl = await ajaxPic(music);
      
      // 构建歌词链接
      const lyricUrl = `https://music-api.gdstudio.xyz/api.php?types=lyric&source=${music.source}&id=${music.lyric_id || music.id}`;
      
      const info: SongInfo = {
        id: music.id,
        name: music.name,
        artist: music.artist,
        album: music.album,
        source: API_CONFIG.sourceLabels[music.source as keyof typeof API_CONFIG.sourceLabels] || music.source,
        songUrl: songUrlData.url,
        coverUrl: coverUrl,
        lyricUrl: lyricUrl,
        bitRate: songUrlData.br as BitRate
      };
      
      setSongInfo(info);
    } catch (err) {
      console.error('Failed to load song info:', err);
      setError(err instanceof Error ? err.message : '加载歌曲信息失败');
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = async (text: string, type: string = '链接') => {
    try {
      await navigator.clipboard.writeText(text);
      showMessage(`${type}已复制到剪贴板`, 'success');
      // 添加复制成功的视觉反馈
      const event = new CustomEvent('copy-success', { detail: { type } });
      window.dispatchEvent(event);
    } catch (err) {
      console.error('Copy failed:', err);
      showMessage('复制失败，请手动复制', 'error');
    }
  };

  const copyAllInfo = async () => {
    if (!songInfo) return;
    
    const info = `
歌曲名：${songInfo.name}
艺术家：${songInfo.artist}
专辑：${songInfo.album}
音乐源：${songInfo.source}
码率：${songInfo.bitRate}kbps

歌曲链接：${songInfo.songUrl}
封面链接：${songInfo.coverUrl}
歌词链接：${songInfo.lyricUrl}
    `.trim();
    
    try {
      await navigator.clipboard.writeText(info);
      showMessage('所有信息已复制到剪贴板', 'success');
    } catch (err) {
      console.error('Copy all failed:', err);
      showMessage('复制失败，请手动复制', 'error');
    }
  };

  const showMessage = (message: string, type: 'success' | 'error') => {
    // 使用简单的alert代替layer.message，保持依赖最小化
    if (type === 'success') {
      alert(message);
    } else {
      alert(message);
    }
  };

  const openExternalLink = (url: string) => {
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  const handleBackdropClick = (event: React.MouseEvent) => {
    if (event.target === event.currentTarget) {
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
      onClick={handleBackdropClick}
    >
      <div className="song-info-modal bg-white rounded-lg max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto relative song-info-modal-scroll">
        {/* 模态框头部 */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h3 className="text-xl font-bold text-gray-900">
            {music ? `${music.name} - ${music.artist}` : '歌曲信息'}
          </h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 text-2xl font-bold w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors"
            aria-label="关闭模态框"
          >
            ×
          </button>
        </div>

        {/* 模态框内容 */}
        <div className="p-6">
          {loading && (
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-500"></div>
              <span className="ml-3 text-gray-600">加载中...</span>
            </div>
          )}

          {error && (
            <div className="text-center py-8 song-info-error rounded-lg p-4">
              <div className="text-red-500 text-lg mb-4">{error}</div>
              <button
                onClick={loadSongInfo}
                className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded song-info-button"
              >
                重新加载
              </button>
            </div>
          )}

          {songInfo && !loading && (
            <div className="space-y-6">
              {/* 基本信息 */}
              <div className="song-info-section bg-gray-50 rounded-lg p-4">
                <h4 className="text-lg font-semibold mb-4 text-gray-900">基本信息</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex flex-col">
                    <label className="song-info-label text-sm font-medium text-gray-600 mb-1">歌曲名</label>
                    <span className="text-gray-900 break-all">{songInfo.name}</span>
                  </div>
                  <div className="flex flex-col">
                    <label className="song-info-label text-sm font-medium text-gray-600 mb-1">艺术家</label>
                    <span className="text-gray-900 break-all">{songInfo.artist}</span>
                  </div>
                  <div className="flex flex-col">
                    <label className="song-info-label text-sm font-medium text-gray-600 mb-1">专辑</label>
                    <span className="text-gray-900 break-all">{songInfo.album}</span>
                  </div>
                  <div className="flex flex-col">
                    <label className="song-info-label text-sm font-medium text-gray-600 mb-1">音乐源</label>
                    <span className="text-gray-900">{songInfo.source}</span>
                  </div>
                  <div className="flex flex-col">
                    <label className="song-info-label text-sm font-medium text-gray-600 mb-1">码率</label>
                    <span className="text-gray-900">{songInfo.bitRate}kbps</span>
                  </div>
                </div>
              </div>

              {/* 链接信息 */}
              <div>
                <h4 className="text-lg font-semibold mb-4 text-gray-900">资源链接</h4>
                <div className="space-y-4">
                  <div className="bg-white border border-gray-200 rounded-lg p-4">
                    <label className="block text-sm font-medium text-gray-600 mb-2">歌曲链接</label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={songInfo.songUrl}
                        readOnly
                        className="song-info-link-input song-info-input flex-1 px-3 py-2 border border-gray-300 rounded-md text-sm font-mono bg-gray-50"
                      />
                      <button
                        onClick={() => copyToClipboard(songInfo.songUrl, '歌曲链接')}
                        className="song-info-button bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
                        title="复制歌曲链接"
                      >
                        复制
                      </button>
                      <button
                        onClick={() => openExternalLink(songInfo.songUrl)}
                        className="song-info-button bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
                        title="在新窗口中打开"
                      >
                        打开
                      </button>
                    </div>
                  </div>

                  <div className="bg-white border border-gray-200 rounded-lg p-4">
                    <label className="block text-sm font-medium text-gray-600 mb-2">封面链接</label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={songInfo.coverUrl}
                        readOnly
                        className="song-info-link-input song-info-input flex-1 px-3 py-2 border border-gray-300 rounded-md text-sm font-mono bg-gray-50"
                      />
                      <button
                        onClick={() => copyToClipboard(songInfo.coverUrl, '封面链接')}
                        className="song-info-button bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
                        title="复制封面链接"
                      >
                        复制
                      </button>
                      <button
                        onClick={() => openExternalLink(songInfo.coverUrl)}
                        className="song-info-button bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
                        title="在新窗口中打开"
                      >
                        打开
                      </button>
                    </div>
                  </div>

                  <div className="bg-white border border-gray-200 rounded-lg p-4">
                    <label className="block text-sm font-medium text-gray-600 mb-2">歌词链接</label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={songInfo.lyricUrl}
                        readOnly
                        className="song-info-link-input song-info-input flex-1 px-3 py-2 border border-gray-300 rounded-md text-sm font-mono bg-gray-50"
                      />
                      <button
                        onClick={() => copyToClipboard(songInfo.lyricUrl, '歌词链接')}
                        className="song-info-button bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
                        title="复制歌词链接"
                      >
                        复制
                      </button>
                      <button
                        onClick={() => openExternalLink(songInfo.lyricUrl)}
                        className="song-info-button bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
                        title="在新窗口中打开"
                      >
                        打开
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* 封面预览 */}
              {songInfo.coverUrl && (
                <div>
                  <h4 className="text-lg font-semibold mb-4 text-gray-900">封面预览</h4>
                  <div className="flex justify-center">
                    <img
                      src={songInfo.coverUrl}
                      alt={songInfo.name}
                      className="song-info-cover-image max-w-xs max-h-xs rounded-lg shadow-md border border-gray-200"
                      onError={(e) => {
                        (e.target as HTMLImageElement).style.display = 'none';
                      }}
                    />
                  </div>
                </div>
              )}

              {/* 操作按钮 */}
              <div className="song-info-buttons flex gap-3 justify-end pt-4 border-t border-gray-200">
                <button
                  onClick={copyAllInfo}
                  className="song-info-button bg-purple-500 hover:bg-purple-600 text-white px-6 py-2 rounded-md font-medium transition-colors"
                >
                  全部复制
                </button>
                <button
                  onClick={onClose}
                  className="song-info-button bg-gray-500 hover:bg-gray-600 text-white px-6 py-2 rounded-md font-medium transition-colors"
                >
                  关闭
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SongInfoModal;