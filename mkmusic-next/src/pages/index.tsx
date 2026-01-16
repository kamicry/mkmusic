import React, { useEffect, useState } from 'react';
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
import { ajaxSearch, ajaxUrl, ajaxPlaylist, ajaxPic } from '../utils/api';
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
  } = usePlayerContext();

  const { msg } = useLayer();
  const [showSearch, setShowSearch] = useState(false);
  const [showMusicInfo, setShowMusicInfo] = useState(false);
  const [selectedMusicIndex, setSelectedMusicIndex] = useState<number | null>(null);
  const [view, setView] = useState<'list' | 'sheet' | 'player'>('list');
  const [isMobile, setIsMobile] = useState(false);

  const loadPlaylist = async (lid: string, index: number) => {
    try {
      const data = await ajaxPlaylist(lid);
      setMusicList(prev => {
        const newList = [...prev];
        newList[index] = {
          id: lid,
          name: data.playlist.name,
          cover: data.playlist.coverImgUrl + "?param=200y200",
          item: data.playlist.tracks.map((track: any) => ({
            id: track.id,
            name: track.name,
            artist: track.ar[0].name,
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
      // 移除自动设置 dislist 的逻辑，避免与默认显示冲突
      // if (index === 3) {
      //     setDislist(3);
      // }
    } catch (error) {
      console.error('Failed to load playlist', error);
    }
  };

  useEffect(() => {
    // Check if mobile device
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 900);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    setMusicList(defaultMusicList);
    
    // Load default playlist
    loadPlaylist("3778678", 3); // 云音乐热歌榜
    
    return () => window.removeEventListener('resize', checkMobile);
  }, [loadPlaylist, setMusicList]);

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
  }, [playHistory, setMusicList]);

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
      const items: Music[] = results.map((item: any) => ({
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
        const music = musicList[0].item[index];
        const playingList = [...musicList[1].item];
        const existingIndex = playingList.findIndex(m => m.id === music.id && m.source === music.source);
        if (existingIndex !== -1) {
            setPlaylist(1);
            setPlayid(existingIndex);
        } else {
            playingList.splice(playid + 1, 0, music);
            setMusicList(prev => {
                const newList = [...prev];
                newList[1].item = playingList;
                return newList;
            });
            setPlaylist(1);
            setPlayid(playid + 1);
        }
    } else {
        if (dislist !== playlist) {
            setMusicList(prev => {
                const newList = [...prev];
                newList[1].item = [...prev[dislist].item];
                return newList;
            });
            setPlaylist(dislist);
        }
        setPlayid(index);
    }
  };

  const handleInfoClick = (index: number) => {
    setSelectedMusicIndex(index);
    setShowMusicInfo(true);
  };

  useEffect(() => {
    if (playlist !== undefined) {
      const music = musicList[playlist]?.item[playid];
      if (music && audioRef.current) {
        // Fetch album cover if not already loaded
        if (!music.pic) {
          ajaxPic(music).then(picUrl => {
            if (picUrl) {
              music.pic = picUrl;
              // Update the music list to trigger re-render
              setMusicList([...musicList]);
            }
          }).catch(error => {
            console.error('Failed to fetch album cover:', error);
          });
        }

        // Fetch music URL
        if (!music.url) {
            ajaxUrl(music, bitRate).then(result => {
                if (result.url && result.url !== 'err') {
                    music.url = result.url;
                    if (audioRef.current) {
                      audioRef.current.src = result.url;
                      audioRef.current.play();
                    }
                    // Add to play history when music starts playing
                    addToPlayHistory(music);
                } else {
                    msg('歌曲链接获取失败');
                }
            }).catch(error => {
                const errorMessage = error instanceof Error ? error.message : '歌曲链接获取失败';
                msg(errorMessage);
            });
        } else {
            audioRef.current.src = music.url;
            audioRef.current.play();
            // Add to play history when music starts playing
            addToPlayHistory(music);
        }
      }
    }
  }, [playlist, playid, musicList, audioRef, bitRate, setMusicList, addToPlayHistory, msg]);

  const currentMusic = playlist !== undefined ? musicList[playlist]?.item[playid] : null;

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
                  {musicList.slice(3).map((sheet, index) => (
                    <div key={index} className="sheet-item" onClick={() => { setDislist(index + 3); setView('list'); }}>
                      <div className="sheet-cover-box">
                        <img src={sheet.cover || 'images/player_cover.png'} className="sheet-cover" alt="sheet cover" />
                      </div>
                      <span className="sheet-name">{sheet.name}</span>
                    </div>
                  ))}
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
