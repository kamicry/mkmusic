import { usePlayer } from '../contexts/PlayerContext';
import { useAudio } from './useAudio';

export const usePlayerControls = () => {
  const {
    audioRef,
    playlist,
    playid,
    setPlaylist,
    setPlayid,
    setPaused,
    paused,
    order,
    setOrder,
    musicList,
    setMusicList,
    dislist
  } = usePlayer();

  const { nextMusic, playMusic } = useAudio();

  // Toggle play/pause
  const togglePlayPause = () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (paused) {
      // First play
      if (playlist === undefined) {
        setPlaylist(dislist);
        // Update playing list
        if (musicList[1]) {
          const updatedMusicList = [...musicList];
          updatedMusicList[1].item = [...musicList[dislist].item];
          setMusicList(updatedMusicList);
          // Save to localStorage
          localStorage.setItem('playing', JSON.stringify(updatedMusicList[1].item));
        }
        
        if (musicList[dislist]?.item.length > 0) {
          listClick(0);
        }
        return;
      }

      audio.play();
      setPaused(false);
    } else {
      audio.pause();
      setPaused(true);
    }
  };

  // Play previous song
  const playPrevious = () => {
    if (playlist === undefined || playid === undefined) return;
    
    let prevId = playid - 1;
    if (prevId < 0) {
      prevId = musicList[playlist].item.length - 1;
    }
    
    playMusic(playlist, prevId);
  };

  // Play next song
  const playNext = () => {
    nextMusic();
  };

  // Change order mode
  const changeOrder = () => {
    let newOrder = order;
    
    switch (order) {
      case 1: // Single -> List
        newOrder = 2;
        break;
      case 3: // Random -> Single
        newOrder = 1;
        break;
      default: // List -> Random
        newOrder = 3;
    }

    setOrder(newOrder);

    // Update UI
    const orderBtn = document.querySelector('.btn-order') as HTMLElement;
    if (orderBtn) {
      orderBtn.className = 'player-btn btn-order';
      
      if (newOrder === 1) {
        orderBtn.classList.add('btn-order-single');
        orderBtn.title = '单曲循环';
      } else if (newOrder === 2) {
        orderBtn.classList.add('btn-order-list');
        orderBtn.title = '列表循环';
      } else if (newOrder === 3) {
        orderBtn.classList.add('btn-order-random');
        orderBtn.title = '随机播放';
      }
    }
  };

  // Handle list item click
  const listClick = (no: number) => {
    if (dislist === 0) {
      // Search list - special handling
      handleSearchListClick(no);
    } else {
      // Regular list
      handleRegularListClick(no);
    }
  };

  const handleSearchListClick = (no: number) => {
    // Search list logic
    if (playlist === undefined) {
      setPlaylist(1); // Set to playing list
      // Update playing list items
      if (musicList[1] && musicList[0].item[no]) {
        const updatedMusicList = [...musicList];
        updatedMusicList[1].item = [...musicList[0].item];
        setMusicList(updatedMusicList);
        // Save to localStorage
        localStorage.setItem('playing', JSON.stringify(updatedMusicList[1].item));
      }
    }

    // Check if song already exists in playing list
    const tmpMusic = musicList[0].item[no];
    let tmpid = no;

    for (let i = 0; i < musicList[1].item.length; i++) {
      if (musicList[1].item[i].id === tmpMusic.id && musicList[1].item[i].source === tmpMusic.source) {
        tmpid = i;
        playMusic(1, tmpid);
        return;
      }
    }

    // Add to playing list after current song
    if (playlist !== undefined && playid !== undefined) {
      const updatedMusicList = [...musicList];
      updatedMusicList[1].item.splice(playid + 1, 0, tmpMusic);
      setMusicList(updatedMusicList);
      tmpid = playid + 1;
      // Save to localStorage
      localStorage.setItem('playing', JSON.stringify(updatedMusicList[1].item));
    }

    playMusic(1, tmpid);
  };

  const handleRegularListClick = (no: number) => {
    // Regular list logic
    if ((dislist !== playlist && dislist !== 1) || playlist === undefined) {
      setPlaylist(dislist);
      // Update playing list
      if (musicList[1] && musicList[dislist]) {
        const updatedMusicList = [...musicList];
        updatedMusicList[1].item = [...musicList[dislist].item];
        setMusicList(updatedMusicList);
        // Save to localStorage
        localStorage.setItem('playing', JSON.stringify(updatedMusicList[1].item));
      }
    }

    playMusic(dislist, no);
  };

  return {
    togglePlayPause,
    playPrevious,
    playNext,
    changeOrder,
    listClick
  };
};