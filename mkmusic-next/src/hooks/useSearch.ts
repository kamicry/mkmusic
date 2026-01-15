import { useState } from 'react';
import { usePlayer } from '../contexts/PlayerContext';
import { useLayer } from './useLayer';

export const useSearch = () => {
  const {
    setWd,
    setSource,
    setLoadPage,
    setDislist,
    musicList,
    setMusicList,
    wd,
    source
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
      // 使用固定的 API 配置
      const apiUrl = '/api/search';
      const response = await fetch(
        `${apiUrl}?name=${encodeURIComponent(searchTerm)}&source=${searchSource}&page=${page}`,
        { signal: AbortSignal.timeout(10000) }
      );
      const data = await response.json();

      if (page === 1) {
        // First page - clear existing results
        if (data.length === 0) {
          msg('没有找到相关歌曲', { anim: 6 });
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
      const newItems = data.map((item: any, index: number) => ({
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

      // Update music list
      const updatedMusicList = [...musicList];
      updatedMusicList[0].item = [...updatedMusicList[0].item, ...newItems];
      setMusicList(updatedMusicList);

      // Update state
      setWd(searchTerm);
      setSource(searchSource);
      setLoadPage(page + 1);
      setDislist(0);

      // Scroll to top if first page
      if (page === 1) {
        listToTop();
      }

      // Add load more indicator if more results might be available
      const loadcount = 20; // 默认每页加载数量
      if (newItems.length >= loadcount) {
        addListBar('more');
      } else {
        addListBar('nomore');
      }

    } catch (error) {
      console.error('Search failed:', error);
      msg('搜索结果获取失败', { anim: 6 });
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
    const tmpHtml = `
      <form onSubmit="return searchSubmit()">
        <div id="search-area">
          <div class="search-group">
            <input type="text" name="wd" id="search-wd" placeholder="搜索歌手、歌名、专辑" autofocus required>
            <button class="search-submit" type="submit">搜 索</button>
          </div>
          <div class="radio-group" id="music-source">
            <label><input type="radio" name="source" value="netease" ${source === 'netease' ? 'checked' : ''}> 网易云</label>
            <label><input type="radio" name="source" value="tencent" ${source === 'tencent' ? 'checked' : ''}> QQ</label>
            <label><input type="radio" name="source" value="xiami" ${source === 'xiami' ? 'checked' : ''}> 虾米</label>
            <label><input type="radio" name="source" value="kugou" ${source === 'kugou' ? 'checked' : ''}> 酷狗</label>
            <label><input type="radio" name="source" value="baidu" ${source === 'baidu' ? 'checked' : ''}> 百度</label>
          </div>
        </div>
      </form>
    `;

    // This would typically use a modal library
    // For now, we'll just log it
    console.log('Show search box:', tmpHtml);

    // Restore previous search
    const searchInput = document.getElementById('search-wd') as HTMLInputElement;
    if (searchInput) {
      searchInput.focus();
      searchInput.value = wd;
    }

    // Restore source selection
    const sourceRadios = document.querySelectorAll(`#music-source input[name='source']`) as NodeListOf<HTMLInputElement>;
    sourceRadios.forEach(radio => {
      if (radio.value === source) {
        radio.checked = true;
      }
    });
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

    // Perform search
    performSearch(searchTerm, selectedSource, 1);

    return false;
  };

  return {
    performSearch,
    isSearching,
    showSearchBox,
    searchSubmit,
    addListhead,
    addListBar
  };
};