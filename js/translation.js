/**************************************************
 * MKOnlinePlayer 翻译切换模块
 * 修复歌词滚动消失和按钮重叠问题
 **************************************************/

var lyricToggle = {
    currentMode: 'original', // original: 原歌词, translation: 翻译歌词
    originalLyric: '',
    translationLyric: '',
    hasTranslation: false,
    
    // 初始化
    init: function() {
        this.bindEvents();
    },
    
    // 绑定事件
    bindEvents: function() {
        var self = this;
        $('#lyric-toggle .toggle-btn').on('click', function() {
            var mode = $(this).data('toggle');
            self.switchMode(mode);
        });
    },
    
    // 切换模式
    switchMode: function(mode) {
        if (!this.hasTranslation || mode === this.currentMode) {
            return;
        }
        
        this.currentMode = mode;
        
        // 更新按钮状态
        $('#lyric-toggle .toggle-btn').removeClass('active');
        $('#lyric-toggle .toggle-btn[data-toggle="' + mode + '"]').addClass('active');
        
        // 重新加载歌词
        this.updateLyricDisplay();
    },
    
    // 设置歌词数据
    setLyrics: function(original, translation) {
        this.originalLyric = original || '';
        this.translationLyric = translation || '';
        this.hasTranslation = !!(translation && translation.trim());
        
        // 显示切换按钮
        if (this.hasTranslation) {
            $('#lyric-toggle').show();
        } else {
            $('#lyric-toggle').hide();
            this.currentMode = 'original';
        }
    },
    
    // 更新歌词显示
    updateLyricDisplay: function() {
        var currentLyric;
        if (this.currentMode === 'translation' && this.hasTranslation) {
            currentLyric = this.translationLyric;
        } else {
            currentLyric = this.originalLyric;
        }
        
        // 重新解析并显示歌词
        if (currentLyric) {
            lyricCallback(currentLyric, musicList[rem.playlist].item[rem.playid].id);
        } else {
            lyricTip('没有歌词');
        }
    },
    
    // 获取当前模式的歌词
    getCurrentLyric: function() {
        if (this.currentMode === 'translation' && this.hasTranslation) {
            return this.translationLyric;
        }
        return this.originalLyric;
    }
};

// 修改原有的歌词回调函数，支持翻译
var originalLyricCallback = lyricCallback;
lyricCallback = function(str, id) {
    if(id !== musicList[rem.playlist].item[rem.playid].id) return;
    
    // 解析原歌词和翻译歌词
    // 这里假设API返回的格式为: 原歌词 + "\n[trans]\n" + 翻译歌词
    var parts = str.split('\n[trans]\n');
    var original = parts[0] || '';
    var translation = parts[1] || '';
    
    // 更新歌词切换器的数据
    lyricToggle.setLyrics(original, translation);
    
    // 调用原歌词回调，显示当前选中的歌词
    var currentStr = lyricToggle.getCurrentLyric();
    originalLyricCallback(currentStr, id);
};

// 页面加载完成后初始化
document.addEventListener('DOMContentLoaded', function() {
    lyricToggle.init();
});

// 滚动到当前歌词行的改进版本
function scrollToCurrentLyric(lineIndex) {
    if (lineIndex < 0) return;
    
    var $lyricList = $('#lyric');
    var $currentLine = $lyricList.find('li[data-no="' + lineIndex + '"]');
    var $scrollContainer = $('.lyric-scroll-container');
    
    if ($currentLine.length === 0) return;
    
    var containerHeight = $scrollContainer.height();
    var lineTop = $currentLine.position().top;
    var lineHeight = $currentLine.outerHeight();
    var currentScrollTop = $scrollContainer.scrollTop();
    
    // 计算目标滚动位置，使当前行居中
    var targetScrollTop = currentScrollTop + lineTop - (containerHeight / 2) + (lineHeight / 2);
    
    // 边界检查
    var maxScrollTop = $lyricList.height() - containerHeight;
    targetScrollTop = Math.max(0, Math.min(targetScrollTop, maxScrollTop));
    
    // 平滑滚动
    $scrollContainer.stop().animate({scrollTop: targetScrollTop}, 1000);
}

// 修复原有的scrollLyric函数中的滚动逻辑
$(document).ready(function() {
    // 保存原始的scrollLyric函数
    var originalScrollLyric = window.scrollLyric;
    
    // 重写scrollLyric函数，使用改进的滚动逻辑
    window.scrollLyric = function(time) {
        if(rem.lyric === '') return false;
        
        time = parseInt(time);
        
        if(rem.lyric === undefined || rem.lyric[time] === undefined) return false;
        
        if(rem.lastLyric == time) return true;
        
        var i = 0;
        for(var k in rem.lyric){
            if(k == time) break;
            i++;
        }
        rem.lastLyric = time;
        
        // 更新当前播放样式
        $(".lplaying").removeClass("lplaying");
        $(".lrc-item[data-no='" + i + "']").addClass("lplaying");
        
        // 使用改进的滚动逻辑
        scrollToCurrentLyric(i);
        
        return true;
    };
});