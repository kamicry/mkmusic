import React, { useEffect } from 'react';
import Head from 'next/head';
import { PlayerProvider } from '../contexts/PlayerContext';
import Header from '../components/Header';
import Center from '../components/Center';
import Footer from '../components/Footer';
import MainPlayer from '../components/MainPlayer';
import { usePlayer } from '../contexts/PlayerContext';

const HomePage: React.FC = () => {
  return (
    <PlayerProvider>
      <HomeContent />
    </PlayerProvider>
  );
};

const HomeContent: React.FC = () => {
  const { audioRef, config, isMobile } = usePlayer();

  useEffect(() => {
    // Initialize audio element
    if (audioRef.current) {
      audioRef.current.volume = config.volume;
    }
  }, [audioRef, config.volume]);

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <Head>
        <title>MKOnlinePlayer v2.4</title>
        <meta name="description" content="一款开源的基于网易云音乐api的在线音乐播放器。具有音乐搜索、播放、下载、歌词同步显示、个人音乐播放列表同步等功能。" />
        <meta name="keywords" content="孟坤播放器,在线音乐播放器,MKOnlinePlayer,网易云音乐,音乐api,音乐播放器源代码" />
        <meta name="viewport" content="width=device-width, initial-scale=1, user-scalable=0" />
        <link rel="shortcut icon" href="/favicon.ico" />
      </Head>

      {/* Background blur container */}
      <div id="blur-img" className="fixed inset-0 z-0"></div>

      {/* Main content */}
      <div className="relative z-10 min-h-screen flex flex-col">
        {/* Header */}
        <Header />

        {/* Center content */}
        <Center />

        {/* Footer */}
        <Footer />
      </div>

      {/* Audio element */}
      <audio ref={audioRef} className="hidden" />

      {/* Main player logic */}
      <MainPlayer />
    </div>
  );
};

export default HomePage;