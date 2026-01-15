import { useState } from 'react';
import { usePlayer } from '../contexts/PlayerContext';
import { useLayer } from './useLayer';
import { ajaxSearch } from '../utils/api';
import { API_CONFIG } from '../config/api.config';

export const useSearch = () => {
  const {
    setWd,
    setSource,
    setLoadPage,
    setDislist,
    musicList,
    setMusicList,
    wd,
    source,
    currentPage,
    setCurrentPage,
    setTotalPages
  } = usePlayer();

  const { msg, close } = useLayer();
  const [isSearching, setIsSearching] = useState<boolean>(false);

  // Perform search
  const performSearch = async (searchTerm: string, searchSource: string = 'netease', page: number = 1) => {
    if (!searchTerm.trim()) {
      msg('搜索内容不能为空', { anim: 6 });
      return;
    }

    let loadingIndex: any;
    if (page === 1) {
      loadingIndex = msg('搜索中', { icon: 16, shade: 0.01, time: 0 });
    }
    
    setIsSearching(true);

    try {
      // Use new GD Studio API
      const data = await ajaxSearch(searchTerm, searchSource as any, page, API_CONFIG.pageSize);

      if (page === 1) {
        // First page - clear existing results
        if (data.length === 0) {
          msg('没有找到相关歌曲', { anim: 6 });
          setTotalPages(1);
          return;
        }

        // Update search results
        const updatedMusicList = [...musicList];
        updatedMusicList[0].item = [];
        setMusicList(updatedMusicList);
      } else {
        // Subsequent pages - remove "load more" indicator
        const loadMoreElement = document.querySelector('.list-loadmore') as HTMLElement;
        if (loadMoreElement) {
          loadMoreElement.classList.remove('list-loadmore');
          loadMoreElement.textContent = '加载中...';
        }
      }

      if (data.length === 0) {
        // No more results
        addListBar('nomore');
        return;
      }

      // Process search results
      const newItems = data.map((item: any) => ({
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

      // Update music list
      const updatedMusicList = [...musicList];
      if (page === 1) {
        // Replace items for first page
        updatedMusicList[0].item = newItems;
      } else {
        // Append items for subsequent pages
        updatedMusicList[0].item = [...updatedMusicList[0].item, ...newItems];
      }
      setMusicList(updatedMusicList);

      // Update state
      setWd(searchTerm);
      setSource(searchSource);
      setLoadPage(page + 1);
      setDislist(0);
      setCurrentPage(page);

      // Calculate total pages based on results
      // If we got full page of results, assume there might be more
      if (newItems.length >= API_CONFIG.pageSize) {
        setTotalPages(page + 1); // At least one more page
      } else {
        setTotalPages(page); // This is the last page
      }

      // Scroll to top if first page
      if (page === 1) {
        listToTop();
      }

      // Add load more indicator if more results might be available
      if (newItems.length >= API_CONFIG.pageSize) {
        addListBar('more');
      } else {
        addListBar('nomore');
      }

    } catch (error) {
      console.error('Search failed:', error);
      const errorMessage = error instanceof Error ? error.message : '搜索结果获取失败';
      msg(errorMessage, { anim: 6 });
    } finally {
      setIsSearching(false);
      if (loadingIndex !== undefined) {
        close(loadingIndex);
      }
    }
  };

  // Add list header
  const addListhead = () => {
    // This will be handled by the MusicList component
  };

  // Add list bar (loading, more, nomore)
  const addListBar = (type: 'loading' | 'more' | 'nomore') => {
    // This will be handled by the MusicList component
    console.log(`Add list bar: ${type}`);
  };

  // Scroll list to top
  const listToTop = () => {
    const mainList = document.getElementById('main-list');
    if (mainList) {
      mainList.scrollTop = 0;
    }
  };

  // Show search box
  const showSearchBox = () => {
    // This is now handled by the SearchPanel component
    console.log('Show search box');
  };

  // Handle search submit
  const searchSubmit = () => {
    const searchInput = document.getElementById('search-wd') as HTMLInputElement;
    if (!searchInput) return false;

    const searchTerm = searchInput.value;
    if (!searchTerm) {
      alert('搜索内容不能为空');
      searchInput.focus();
      return false;
    }

    const selectedSource = (document.querySelector('#music-source input[name="source"]:checked') as HTMLInputElement)?.value || 'netease';

    // Close search box (would be handled by modal library)
    console.log('Close search box');

    // Reset load page
    setLoadPage(1);
    setCurrentPage(1);

    // Perform search
    performSearch(searchTerm, selectedSource, 1);

    return false;
  };

  // Load more results (next page)
  const loadMore = () => {
    if (!isSearching && wd) {
      performSearch(wd, source, currentPage + 1);
    }
  };

  return {
    performSearch,
    isSearching,
    showSearchBox,
    searchSubmit,
    addListhead,
    addListBar,
    loadMore
  };
};
