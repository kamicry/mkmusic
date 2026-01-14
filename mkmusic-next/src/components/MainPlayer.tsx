import React, { useEffect } from 'react';
import { usePlayer } from '../contexts/PlayerContext';
import { useAudio } from '../hooks/useAudio';
import { usePlayerControls } from '../hooks/usePlayerControls';
import { useLyric } from '../hooks/useLyric';
import { useSearch } from '../hooks/useSearch';
import { playerSavedata } from '../utils/storage';

const MainPlayer: React.FC = () => {
  const {
    audioRef,
    config,
    volume,
    setVolume,
    musicList,
    setMusicList,
    dislist,
    setDislist,
    playlist,
    playid,
    setPlaylist,
    setPlayid,
    isMobile
  } = usePlayer();

  const { playMusic } = useAudio();
  const { togglePlayPause, playPrevious, playNext, changeOrder, listClick } = usePlayerControls();
  const { lyricAreaRef, displayLyrics } = useLyric();
  const { showSearchBox, performSearch } = useSearch();

  // Initialize player
  useEffect(() => {
    // Set up event listeners
    const setupEventListeners = () => {
      // Button event listeners
      document.querySelector('.btn-play')?.addEventListener('click', (e) => {
        e.preventDefault();
        togglePlayPause();
      });

      document.querySelector('.btn-prev')?.addEventListener('click', (e) => {
        e.preventDefault();
        playPrevious();
      });

      document.querySelector('.btn-next')?.addEventListener('click', (e) => {
        e.preventDefault();
        playNext();
      });

      document.querySelector('.btn-order')?.addEventListener('click', (e) => {
        e.preventDefault();
        changeOrder();
      });

      // Search button
      document.querySelector('.btn[data-action="search"]')?.addEventListener('click', (e) => {
        e.preventDefault();
        showSearchBox();
      });

      // List buttons
      document.querySelector('.btn[data-action="playing"]')?.addEventListener('click', (e) => {
        e.preventDefault();
        setDislist(1);
      });

      document.querySelector('.btn[data-action="sheet"]')?.addEventListener('click', (e) => {
        e.preventDefault();
        setDislist(3); // Show first custom playlist
      });

      // List item clicks
      document.querySelectorAll('.list-item').forEach(item => {
        item.addEventListener('click', (e) => {
          const no = parseInt(item.getAttribute('data-no') || '0');
          listClick(no);
        });
      });
    };

    setupEventListeners();

    // Initialize background blur if enabled
    if ((config.coverbg && !isMobile) || (config.mcoverbg && isMobile)) {
      if (isMobile) {
        // Mobile blur implementation
        const blurImg = document.getElementById('blur-img');
        if (blurImg) {
          blurImg.innerHTML = '<div class="blured-img" id="mobile-blur"></div><div class="blur-mask mobile-mask"></div>';
        }
      } else {
        // Desktop blur implementation would go here
        // This would use a background blur library
      }
    }

    // Load default playlist
    if (config.defaultlist && musicList[config.defaultlist]) {
      setDislist(config.defaultlist);
    }

  }, [config, isMobile, musicList, setDislist, togglePlayPause, playPrevious, playNext, changeOrder, listClick, showSearchBox]);

  // Handle volume changes
  useEffect(() => {
    const audio = audioRef.current;
    if (audio) {
      audio.volume = volume;
    }
    
    // Save volume to localStorage
    playerSavedata('volume', volume);
  }, [volume, audioRef]);

  // Handle playlist changes
  useEffect(() => {
    if (playlist !== undefined && playid !== undefined && musicList[playlist]?.item[playid]) {
      const music = musicList[playlist].item[playid];
      
      // Update cover
      const coverImg = document.getElementById('music-cover') as HTMLImageElement;
      if (coverImg) {
        coverImg.src = music.pic || '/images/player_cover.png';
      }
      
      // Update mobile blur background if enabled
      if (config.mcoverbg && isMobile && music.pic) {
        const mobileBlur = document.getElementById('mobile-blur');
        if (mobileBlur) {
          mobileBlur.style.backgroundImage = `url("${music.pic}")`;
        }
      }
      
      // Display lyrics if available
      if (music.lyric_id) {
        displayLyrics();
      } else {
        // Show no lyrics message
        if (lyricAreaRef.current) {
          lyricAreaRef.current.innerHTML = '<li class="lyric-tip">没有歌词</li>';
        }
      }
    }
  }, [playlist, playid, musicList, config, isMobile, displayLyrics]);

  return null; // This component doesn't render anything itself
};

export default MainPlayer;