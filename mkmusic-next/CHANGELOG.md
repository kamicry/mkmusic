# Changelog

## [2.5.0] - API Migration to GD Studio - 2025-01-15

### 🎉 Major Changes

#### API Migration
- **完全迁移到 GD Studio's Online Music Platform API**
  - 新的API基础URL: `https://music-api.gdstudio.xyz/api.php`
  - 移除不稳定的音乐源，只保留三个稳定源：netease (网易云)、kuwo (酷我)、joox (JOOX)
  - 实现请求速率限制（5分钟内最多50次请求）
  - 添加完善的错误处理和用户反馈

### ✨ New Features

#### 1. 码率选择功能
- 支持5种码率选项：
  - 128kbps - 低质量，小文件
  - 192kbps - 中等质量
  - 320kbps - 高质量（推荐，默认）
  - 740kbps - 无损质量
  - 999kbps - 超品无损质量
- 在搜索面板中添加码率选择下拉菜单
- 播放时根据选择的码率获取音乐URL

#### 2. 分页功能
- 搜索结果支持分页显示
- 提供页码跳转下拉选择器
- 添加"上一页"和"下一页"按钮
- 显示当前页码和总页数
- 每页显示20条结果

#### 3. API速率限制
- 实现客户端请求追踪
- 5分钟内最多50次请求的限制
- 超出限制时显示友好的错误消息
- 自动清理过期的请求记录

### 🔧 Technical Improvements

#### 新增文件
- `src/config/api.config.ts` - API配置中心
  - 定义API端点
  - 配置音乐源
  - 定义码率选项
  - 实现速率限制器类

#### 更新的文件
1. **src/utils/api.ts**
   - 完全重写API调用函数
   - 添加码率参数到 `ajaxUrl()`
   - 改进错误处理
   - 添加请求超时控制（10秒）
   - 集成速率限制检查

2. **src/contexts/PlayerContext.tsx**
   - 添加 `bitRate` 状态
   - 添加 `currentPage` 状态
   - 添加 `totalPages` 状态
   - 导出相应的setter函数

3. **src/components/SearchPanel.tsx**
   - 重新设计UI以支持新功能
   - 添加码率选择下拉菜单
   - 添加分页控制
   - 移除不稳定的音乐源选项
   - 添加API来源标注

4. **src/hooks/useSearch.ts**
   - 使用新的GD Studio API
   - 实现分页逻辑
   - 改进错误处理
   - 添加 `loadMore()` 函数

5. **src/pages/index.tsx**
   - 更新 `handleSearch()` 支持分页参数
   - 在音乐URL请求中传递码率参数
   - 改进错误消息显示

6. **src/components/LyricPanel.tsx**
   - 适配新API返回的歌词格式
   - 处理 `lyric` 和 `tlyric` 字段

7. **src/pages/_app.tsx**
   - 导入新的搜索面板样式

#### 新增样式
- `src/styles/search-panel.css` - 搜索面板专用样式
  - 码率选择器样式
  - 分页控制样式
  - 响应式设计
  - 加载和错误状态样式

### 📚 Documentation

新增文档：
- **API_MIGRATION.md** - 完整的API迁移指南
  - API端点详细说明
  - 请求/响应格式
  - 码率和分页功能说明
  - 使用规范和限制
  - 迁移检查清单

- **API_TEST.md** - 全面的测试指南
  - 9个主要测试类别
  - 详细的测试步骤
  - 预期结果
  - 常见问题解决方案
  - 测试结果模板

- **CHANGELOG.md** (本文件) - 更改日志

更新文档：
- **README.md** - 添加功能介绍和API说明

### 🎨 UI/UX Improvements

1. **搜索面板重新设计**
   - 更清晰的布局
   - 改进的表单控件
   - 添加视觉分组
   - 响应式设计优化

2. **用户反馈**
   - 改进的加载指示器
   - 更友好的错误消息
   - API来源标注
   - 当前状态指示

3. **可访问性**
   - 键盘导航支持
   - 聚焦指示器
   - 禁用状态视觉反馈
   - 语义化HTML

### 🐛 Bug Fixes

- 修复音乐源选择问题
- 改进歌词显示逻辑
- 修复TypeScript类型错误
- 改进网络错误处理

### ⚠️ Breaking Changes

1. **移除的音乐源**
   - tencent (QQ音乐)
   - xiami (虾米) - 已关闭服务
   - kugou (酷狗)
   - baidu (百度音乐)
   - tidal
   - spotify

2. **API变更**
   - 所有API调用现在使用新的GD Studio API
   - `ajaxUrl()` 现在接受码率参数
   - `ajaxLyric()` 返回格式变更（包含 lyric 和 tlyric 字段）
   - `ajaxPic()` 使用新的图片尺寸参数

3. **不再支持的功能**
   - 旧的playlist和userlist端点可能不可用

### 📊 Performance

- 请求超时设置为10秒
- 实现客户端速率限制以避免过多请求
- 优化搜索结果加载
- 改进状态管理

### 🔐 Security & Compliance

- 遵守API使用规范（5分钟50次请求限制）
- 添加API来源标注："GD音乐台(music.gdstudio.xyz)"
- 仅用于学习目的，不用于商业用途
- 尊重原作者（metowolf & mengkun, Modified by GD Studio）

### 📝 Notes

- 此版本需要互联网连接才能访问GD Studio API
- 建议使用320kbps码率以获得最佳音质和加载速度平衡
- 无损音质(740kbps, 999kbps)可能不是所有歌曲都支持
- API可能有地区限制

### 🔄 Migration Guide

如果从旧版本升级：

1. **更新依赖**
   ```bash
   npm install
   ```

2. **清除旧数据**
   - 清除浏览器缓存
   - 清除localStorage中的旧数据

3. **配置检查**
   - 检查 `src/config/api.config.ts` 中的配置
   - 确认网络可以访问 GD Studio API

4. **测试**
   - 运行 TypeScript 检查: `npx tsc --noEmit`
   - 启动开发服务器: `npm run dev`
   - 按照 API_TEST.md 进行测试

### 🚀 Future Plans

计划中的功能：
- [ ] 缓存API响应以减少请求次数
- [ ] 添加收藏功能
- [ ] 支持播放列表导出/导入
- [ ] 添加音乐下载功能（符合版权规定）
- [ ] 改进移动端体验
- [ ] 添加深色模式
- [ ] 支持键盘快捷键
- [ ] 添加音乐可视化效果

### 👥 Contributors

- API Migration: Based on task requirements
- Original Player: mengkun (MKOnlinePlayer)
- API Provider: GD Studio (music.gdstudio.xyz)
- Original API: metowolf & mengkun

### 📄 License

This project is for educational purposes only. Please respect the original authors and API providers.

---

## Previous Versions

### [2.4.0] - Previous Version
- Original MKOnlinePlayer implementation
- Multiple music sources support
- Basic search and playback functionality

---

**Full Changelog**: See individual commit messages for detailed changes
