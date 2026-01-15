import React, { useEffect, useState } from 'react';
import Head from 'next/head';
import Header from '../components/Header';
import Footer from '../components/Footer';
import BtnBar from '../components/BtnBar';
import MusicList from '../components/MusicList';
import DataArea from '../components/DataArea';
import MainPlayer from '../components/MainPlayer';
import SearchPanel from '../components/SearchPanel';
import { usePlayerContext } from '../contexts/PlayerContext';
import { defaultMusicList } from '../utils/musicList';
import { ajaxSearch, ajaxUrl, ajaxPlaylist } from '../utils/api';
import { useLayer } from '../hooks/useLayer';
import { Music, Playlist } from '../types';

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
  } = usePlayerContext();

  const { msg } = useLayer();
  const [showSearch, setShowSearch] = useState(false);
  const [view, setView] = useState<'list' | 'sheet' | 'player'>('list');
  const [isMobile, setIsMobile] = useState(false);

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
  }, []);

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
      if (index === 3) { // Default list to show
          setDislist(3);
      }
    } catch (error) {
      console.error('Failed to load playlist', error);
    }
  };

  const handleSearch = async (wd: string, source: string) => {
    setWd(wd);
    setSource(source);
    setLoadPage(1);
    const loading = msg('搜索中', { icon: 16, shade: 0.01, time: 0 });
    try {
      const results = await ajaxSearch(wd, source, 1, 20);
      const items: Music[] = results.map((item: any) => ({
        id: item.id,
        name: item.name,
        artist: item.artist[0],
        album: item.album,
        source: item.source,
        url_id: item.url_id,
        pic_id: item.pic_id,
        lyric_id: item.lyric_id,
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
      msg('搜索失败');
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

  useEffect(() => {
    if (playlist !== undefined) {
      const music = musicList[playlist]?.item[playid];
      if (music && audioRef.current) {
        if (!music.url) {
            ajaxUrl(music).then(url => {
                if (url && url !== 'err') {
                    music.url = url;
                    if (audioRef.current) {
                      audioRef.current.src = url;
                      audioRef.current.play();
                    }
                } else {
                    msg('歌曲链接获取失败');
                }
            });
        } else {
            audioRef.current.src = music.url;
            audioRef.current.play();
        }
      }
    }
  }, [playlist, playid, musicList, audioRef]);

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
                if (type === 'playing') { setDislist(1); setView('list'); }
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
        <div className="layer-anim layui-layer layui-layer-page" style={{ zIndex: 19891015, width: '450px', top: '100px', left: '50%', marginLeft: '-225px', position: 'fixed' }}>
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
    </>
  );
}
