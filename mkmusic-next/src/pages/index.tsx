import React, { useEffect, useRef, useState } from 'react';
import Head from 'next/head';
import Header from '../components/Header';
import Footer from '../components/Footer';
import BtnBar from '../components/BtnBar';
import MusicList from '../components/MusicList';
import DataArea from '../components/DataArea';
import MainPlayer from '../components/MainPlayer';
import SearchPanel from '../components/SearchPanel';
import MusicInfoPanel from '../components/MusicInfoPanel';
import { usePlayerContext } from '../contexts/PlayerContext';
import { defaultMusicList } from '../utils/musicList';
import { ApiSearchResult, ajaxSearch, ajaxUrl, ajaxPlaylist, ajaxPic } from '../utils/api';
import { useLayer } from '../hooks/useLayer';
import { Music } from '../types';

export default function Home() {
  const {
    audioRef,
    playlist,
    setPlaylist,
    playid,
    setPlayid,
    dislist,
    setDislist,
    musicList,
    setMusicList,
    setWd,
    setSource,
    setLoadPage,
    bitRate,
    playHistory,
    addToPlayHistory,
    clearPlayHistoryCtx,
  } = usePlayerContext();

  const { msg } = useLayer();
  const [showSearch, setShowSearch] = useState(false);
  const [showMusicInfo, setShowMusicInfo] = useState(false);
  const [selectedMusicIndex, setSelectedMusicIndex] = useState<number | null>(null);
  const [view, setView] = useState<'list' | 'sheet' | 'player'>('list');
  const [isMobile, setIsMobile] = useState(false);
  const lastLoadedAudioKeyRef = useRef<string>('');
  const currentMusicRef = useRef<Music | null>(null);

  useEffect(() => {
    // Check if mobile device
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 900);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    // 初始化时只设置默认歌单列表，不依赖 loadPlaylist
    setMusicList(defaultMusicList);
    
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // 单独加载默认播放列表的 useEffect，不依赖其他状态
  useEffect(() => {
    interface PlaylistTrack {
      id: string;
      name: string;
      ar: Array<{ name: string }>;
      al: { name: string; picUrl: string };
    }

    interface PlaylistResponse {
      playlist: {
        name: string;
        coverImgUrl: string;
        tracks: PlaylistTrack[];
      };
    }

    const loadDefaultPlaylist = async () => {
      try {
        const data = await ajaxPlaylist<PlaylistResponse>("3778678"); // 云音乐热歌榜
        setMusicList(prev => {
          const newList = [...prev];
          newList[3] = {
            id: "3778678",
            name: data.playlist.name,
            cover: data.playlist.coverImgUrl + "?param=200y200",
            item: data.playlist.tracks.map((track) => ({
              id: track.id,
              name: track.name,
              artist: track.ar[0]?.name || '',
              album: track.al.name,
              source: "netease",
              url_id: track.id,
              pic_id: null,
              lyric_id: track.id,
              pic: track.al.picUrl + "?param=300y300",
              url: null
            }))
          };
          return newList;
        });
      } catch (error) {
        console.error('Failed to load default playlist', error);
      }
    };

    loadDefaultPlaylist();
  }, []);

  // Initialize and update play history in musicList when playHistory changes
  useEffect(() => {
    setMusicList(prev => {
      const newList = [...prev];
      // Add or update play history playlist at index 2
      newList[2] = {
        id: 'play_history',
        name: '播放历史',
        cover: 'images/player_cover.png',
        item: playHistory,
        creatorName: ''
      };
      return newList;
    });
  }, [playHistory]); // 只依赖 playHistory，避免循环依赖

  // Set initial view to show play history after component mounts
  useEffect(() => {
    if (musicList.length > 0) {
      setDislist(1); // Show "正在播放" by default
      setView('list');
    }
  }, [musicList.length, setDislist]);

  const handleSearch = async (wd: string, source: string, page: number = 1) => {
    setWd(wd);
    setSource(source);
    setLoadPage(page);
    try {
      const results = await ajaxSearch(wd, source as any, page, 20);
      const items: Music[] = results.map((item: ApiSearchResult) => ({
        id: item.id,
        name: item.name,
        artist: Array.isArray(item.artist) ? item.artist[0] : item.artist,
        album: item.album,
        source: item.source,
        url_id: item.url_id || item.id,
        pic_id: item.pic_id || item.id,
        lyric_id: item.lyric_id || item.id,
        pic: null,
        url: null
      }));
      setMusicList(prev => {
        const newList = [...prev];
        newList[0].item = items;
        newList[1].item = items;
        return newList;
      });
      setDislist(0);
      setView('list');
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : '搜索失败';
      msg(errorMessage);
    }
  };

  const handleItemClick = async (index: number) => {
    if (dislist === 0) { // From search
        setMusicList(prev => {
            const newList = [...prev];
            newList[1].item = [...prev[0].item];
            return newList;
        });
        setPlaylist(1);
        setPlayid(index);
    } else {
        if (dislist !== 1) {
            setMusicList(prev => {
                const newList = [...prev];
                newList[1].item = [...prev[dislist].item];
                return newList;
            });
        }
        setPlaylist(1);
        setPlayid(index);
    }
  };

  const handleInfoClick = (index: number) => {
    setSelectedMusicIndex(index);
    setShowMusicInfo(true);
  };

  const currentMusic = playlist !== undefined ? musicList[playlist]?.item[playid] : null;
  const currentMusicKey = currentMusic
    ? `${playlist}:${playid}:${currentMusic.source}:${currentMusic.id}:${currentMusic.url_id}:${currentMusic.pic_id ?? ''}`
    : '';

  useEffect(() => {
    currentMusicRef.current = currentMusic;
  }, [currentMusic]);

  useEffect(() => {
    const audio = audioRef.current;
    const music = currentMusicRef.current;
    if (!music || !audio || playlist === undefined || !currentMusicKey) {
      return;
    }

    const playbackKey = `${currentMusicKey}:${bitRate}`;
    if (lastLoadedAudioKeyRef.current === playbackKey) {
      return;
    }

    lastLoadedAudioKeyRef.current = playbackKey;
    let cancelled = false;

    const updateCurrentMusic = (updates: Partial<Music>) => {
      setMusicList(prev => {
        const list = prev[playlist];
        const item = list?.item[playid];

        if (!item || item.id !== music.id || item.source !== music.source) {
          return prev;
        }

        const next = [...prev];
        next[playlist] = {
          ...list,
          item: list.item.map((entry, index) => (
            index === playid ? { ...entry, ...updates } : entry
          ))
        };
        return next;
      });
    };

    if (!music.pic) {
      ajaxPic(music).then(picUrl => {
        if (!cancelled && picUrl) {
          updateCurrentMusic({ pic: picUrl });
        }
      }).catch(error => {
        console.error('Failed to fetch album cover:', error);
      });
    }

    const loadAudio = async () => {
      try {
        let musicUrl = music.url;

        if (!musicUrl) {
          const result = await ajaxUrl(music, bitRate);
          if (!result.url || result.url === 'err') {
            if (lastLoadedAudioKeyRef.current === playbackKey) {
              lastLoadedAudioKeyRef.current = '';
            }
            msg('歌曲链接获取失败');
            return;
          }
          musicUrl = result.url;
          updateCurrentMusic({ url: musicUrl });
        }

        if (cancelled || !musicUrl) {
          return;
        }

        audio.src = musicUrl;
        lastLoadedAudioKeyRef.current = playbackKey;

        await audio.play();
        addToPlayHistory({ ...music, url: musicUrl });
      } catch (error) {
        if (cancelled) {
          return;
        }
        if (lastLoadedAudioKeyRef.current === playbackKey) {
          lastLoadedAudioKeyRef.current = '';
        }
        const errorMessage = error instanceof Error ? error.message : '歌曲链接获取失败';
        msg(errorMessage);
      }
    };

    loadAudio();

    return () => {
      cancelled = true;
    };
  }, [currentMusicKey, playlist, playid, audioRef, bitRate, setMusicList, addToPlayHistory, msg]);

  return (
    <>
      <Head>
        <title>{currentMusic ? `正在播放: ${currentMusic.name} - ${currentMusic.artist}` : 'MKOnlinePlayer v2.4'}</title>
      </Head>
      
      <div id="blur-img">
        <div 
          className="blured-img" 
          style={{ 
            backgroundImage: currentMusic?.pic ? `url(${currentMusic.pic})` : 'none',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            filter: 'blur(50px)',
            transform: 'scale(1.1)',
            height: '100%',
            width: '100%',
            transition: 'background-image 1s'
          }}
        ></div>
        <div className="blur-mask" style={{ display: 'block' }}></div>
      </div>

      <Header />

      <div className="center">
        <div className="container">
          <BtnBar 
            onSearchClick={() => setShowSearch(true)} 
            onShowList={(type) => {
                if (type === 'list') { setDislist(1); setView('list'); }
                else if (type === 'sheet') setView('sheet');
                else if (type === 'player') setView('player');
            }}
            activeView={view}
          />
          
          <div style={{ display: (isMobile && view === 'player') ? 'none' : 'block' }}>
            <DataArea>
              {view === 'sheet' && (
                <div id="sheet" className="data-box">
                  <div className="sheet-section">
                    <h3>播放历史</h3>
                    <div className="sheet-item" onClick={() => { setDislist(2); setView('list'); }}>
                      <div className="sheet-cover-box">
                        <img src={playHistory.length > 0 && playHistory[0].pic ? playHistory[0].pic : 'images/player_cover.png'} className="sheet-cover" alt="播放历史" />
                      </div>
                      <span className="sheet-name">播放历史 ({playHistory.length})</span>
                      {playHistory.length > 0 && (
                        <button 
                          className="clear-history-btn" 
                          onClick={(e) => {
                            e.stopPropagation();
                            if (window.confirm('确定要清空所有播放历史吗？')) {
                              clearPlayHistoryCtx();
                            }
                          }}
                        >
                          清空
                        </button>
                      )}
                    </div>
                  </div>
                  <div className="sheet-section">
                    <h3>推荐歌单</h3>
                    {musicList.slice(3).map((sheet, index) => (
                      <div key={index} className="sheet-item" onClick={() => { setDislist(index + 3); setView('list'); }}>
                        <div className="sheet-cover-box">
                          <img src={sheet.cover || 'images/player_cover.png'} className="sheet-cover" alt="sheet cover" />
                        </div>
                        <span className="sheet-name">{sheet.name}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              
              {view === 'list' && (
                <MusicList 
                  list={musicList[dislist]?.item || []} 
                  currentPlayId={playlist === dislist ? playid : undefined}
                  onItemClick={handleItemClick}
                  onInfoClick={handleInfoClick}
                  dislist={dislist}
                />
              )}
            </DataArea>
          </div>

          <MainPlayer style={{ display: (isMobile && view !== 'player') ? 'none' : 'block' }} />
        </div>
      </div>

      <Footer />

      <audio ref={audioRef} style={{ display: 'none' }} />

      {showSearch && (
        <div 
          className="layer-anim layui-layer layui-layer-page"
          style={{ 
            zIndex: 19891015, 
            width: '90%',
            maxWidth: '450px',
            top: '50%',
            left: '50%',
            marginLeft: '-45%',
            marginTop: '-150px',
            position: 'fixed',
            transform: 'translate(-50%, -50%)'
          }}
        >
          <div className="layui-layer-content">
            <SearchPanel 
              onSearch={handleSearch} 
              onClose={() => setShowSearch(false)} 
            />
          </div>
          <span className="layui-layer-setwin">
            <a className="layui-layer-ico layui-layer-close layui-layer-close1" href="javascript:;" onClick={() => setShowSearch(false)}></a>
          </span>
        </div>
      )}

      {showMusicInfo && selectedMusicIndex !== null && (
        <>
          <div 
            className="music-info-backdrop" 
            onClick={() => setShowMusicInfo(false)}
          />
          <MusicInfoPanel 
            music={musicList[dislist]?.item[selectedMusicIndex]} 
            onClose={() => setShowMusicInfo(false)} 
          />
        </>
      )}
    </>
  );
}
