# API Integration Testing Guide

This document provides a comprehensive testing guide for the GD Studio API integration.

## Pre-Testing Checklist

Before starting tests, ensure:
- [x] All dependencies are installed (`npm install`)
- [x] TypeScript compiles without errors (`npx tsc --noEmit`)
- [x] Development server can start (`npm run dev`)

## Test Cases

### 1. Search Functionality Tests

#### Test 1.1: Basic Search
**Steps:**
1. Open the application
2. Click the search button
3. Enter a search term (e.g., "周杰伦")
4. Select "netease" as the source
5. Click "搜索"

**Expected Result:**
- Loading indicator appears
- Search results display with song names, artists, and albums
- Results show the correct source (netease)

#### Test 1.2: Search with Different Sources
**Steps:**
1. Perform search with "netease" source
2. Perform same search with "kuwo" source
3. Perform same search with "joox" source

**Expected Result:**
- Each source returns different results
- All results display correctly
- No errors occur

#### Test 1.3: Pagination
**Steps:**
1. Search for a common term
2. Wait for results to load
3. Check if pagination controls appear
4. Click "下一页"
5. Use dropdown to jump to page 3
6. Click "上一页"

**Expected Result:**
- Pagination controls appear when results > 20
- Page navigation works correctly
- Current page indicator updates
- Results update for each page

### 2. Bit Rate Selection Tests

#### Test 2.1: Select Different Bit Rates
**Steps:**
1. Open search panel
2. Change bit rate selector from 320kbps to 128kbps
3. Search for a song
4. Play the song
5. Check network requests for the audio URL

**Expected Result:**
- Bit rate parameter (br=128) is sent in the URL request
- Audio quality matches selected bit rate

#### Test 2.2: All Bit Rate Options
**Steps:**
Test each bit rate option:
- 128kbps
- 192kbps
- 320kbps (default)
- 740kbps (lossless)
- 999kbps (ultra-high)

**Expected Result:**
- All options are selectable
- Audio URLs are fetched with correct bit rate parameter
- Higher bit rates result in larger file sizes

### 3. Music Playback Tests

#### Test 3.1: Play Music from Search
**Steps:**
1. Search for a song
2. Click on a search result
3. Wait for music to load

**Expected Result:**
- Music URL is fetched successfully
- Audio starts playing
- Player controls update
- Album cover displays (if available)

#### Test 3.2: Play Music from Different Sources
**Steps:**
1. Play a song from netease
2. Play a song from kuwo
3. Play a song from joox

**Expected Result:**
- All sources work correctly
- Music plays without errors
- Transitions between sources are smooth

#### Test 3.3: Bit Rate Change During Playback
**Steps:**
1. Start playing a song
2. Open search panel
3. Change bit rate
4. Play another song

**Expected Result:**
- New song uses the updated bit rate
- No errors occur
- Audio quality reflects the change

### 4. Lyrics Tests

#### Test 4.1: Display Lyrics
**Steps:**
1. Play a song
2. Check if lyrics display
3. Wait for lyrics to scroll

**Expected Result:**
- Lyrics appear in the lyrics panel
- Lyrics scroll in sync with the music
- Current line is highlighted

#### Test 4.2: Lyrics from Different Sources
**Steps:**
Test lyrics from:
- Netease songs
- Kuwo songs
- JOOX songs

**Expected Result:**
- Lyrics display for all sources (when available)
- "没有歌词" message shows when lyrics unavailable

### 5. Rate Limiting Tests

#### Test 5.1: Normal Usage
**Steps:**
1. Perform 10 searches
2. Play 10 different songs
3. Check for any rate limit errors

**Expected Result:**
- No rate limit errors (under 50 requests/5 minutes)
- All requests complete successfully

#### Test 5.2: Rate Limit Exceeded (Optional)
**Steps:**
1. Make rapid successive searches (50+ in 5 minutes)
2. Observe error messages

**Expected Result:**
- Rate limit error message appears
- User-friendly error message displays
- Application handles error gracefully

### 6. Error Handling Tests

#### Test 6.1: Empty Search
**Steps:**
1. Open search panel
2. Leave search field empty
3. Click "搜索"

**Expected Result:**
- Validation error: "搜索内容不能为空"
- Search is prevented

#### Test 6.2: No Results
**Steps:**
1. Search for nonsense text (e.g., "asdfghjklqwerty")
2. Submit search

**Expected Result:**
- Message: "没有找到相关歌曲"
- Empty state displayed

#### Test 6.3: Network Error Simulation
**Steps:**
1. Disconnect from internet
2. Try to search
3. Try to play a song

**Expected Result:**
- Network error messages appear
- Application doesn't crash
- Helpful error message displays

### 7. UI/UX Tests

#### Test 7.1: Search Panel UI
**Steps:**
1. Open search panel
2. Check all UI elements:
   - Search input
   - Source selection radios
   - Bit rate dropdown
   - Pagination controls
   - API credit footer

**Expected Result:**
- All elements display correctly
- Layout is clean and organized
- Responsive on different screen sizes

#### Test 7.2: Mobile Responsiveness
**Steps:**
1. Open application on mobile device or use responsive mode
2. Test search functionality
3. Test pagination controls
4. Test bit rate selection

**Expected Result:**
- All controls work on mobile
- Layout adapts to small screens
- Touch interactions work smoothly

#### Test 7.3: Keyboard Navigation
**Steps:**
1. Open search panel
2. Use Tab key to navigate
3. Use Enter to submit search
4. Use arrow keys in dropdowns

**Expected Result:**
- Keyboard navigation works
- Focus indicators are visible
- Form submission works with Enter key

### 8. Integration Tests

#### Test 8.1: Complete User Flow
**Steps:**
1. Open application
2. Search for a song
3. Select bit rate (740kbps)
4. Navigate to page 2
5. Play a song
6. Check lyrics
7. Play next song
8. Change music source
9. Search again

**Expected Result:**
- Entire flow works seamlessly
- State is maintained correctly
- No errors occur

#### Test 8.2: Multiple Sessions
**Steps:**
1. Search and play music
2. Refresh the page
3. Search and play again
4. Close and reopen browser
5. Test again

**Expected Result:**
- Application works after refresh
- Rate limiting is tracked correctly
- No data corruption

### 9. Performance Tests

#### Test 9.1: Response Time
**Steps:**
1. Measure search request time
2. Measure music URL fetch time
3. Measure lyrics fetch time
4. Measure album cover fetch time

**Expected Result:**
- Most requests complete within 2-3 seconds
- No timeouts (10 second limit)
- Loading indicators show during waits

#### Test 9.2: Memory Usage
**Steps:**
1. Open browser DevTools
2. Monitor memory usage
3. Perform multiple searches
4. Play multiple songs
5. Check for memory leaks

**Expected Result:**
- Memory usage stays reasonable
- No significant memory leaks
- Application remains responsive

## Test Results Template

Use this template to record test results:

```
Date: ___________
Tester: ___________
Browser/Device: ___________

Test Case: ___________
Status: [ ] Pass [ ] Fail [ ] Blocked
Notes: ___________
Screenshots: ___________
```

## Common Issues and Solutions

### Issue 1: Rate Limit Exceeded
**Solution:** Wait 5 minutes before making more requests

### Issue 2: Music Won't Play
**Solution:** 
- Check if bit rate is too high for the source
- Try a different bit rate (320kbps or lower)
- Try a different music source

### Issue 3: No Search Results
**Solution:**
- Try a different music source
- Check spelling of search term
- Try more common search terms

### Issue 4: Lyrics Not Displaying
**Solution:**
- Some songs may not have lyrics
- Try playing a different song
- Check if lyrics are available for that source

## Automated Testing

For future implementation, consider:
- Jest unit tests for API utility functions
- Cypress E2E tests for user flows
- API mocking for reliable testing
- Performance monitoring tools

## Reporting Issues

When reporting issues, include:
1. Test case ID
2. Steps to reproduce
3. Expected vs actual result
4. Screenshots/videos
5. Browser/device information
6. Network console logs

---

**Testing Completed**: ☐ Yes ☐ No  
**All Tests Passed**: ☐ Yes ☐ No  
**Critical Issues**: ___________  
**Sign-off**: ___________ Date: ___________
