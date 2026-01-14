export interface LyricLine {
  time: number;
  text: string;
}

export function parseLyric(lrc: string): LyricLine[] {
  if (!lrc) return [];
  const lines = lrc.split('\n');
  const result: LyricLine[] = [];
  const timeExp = /\[(\d{2}):(\d{2})\.(\d{2,3})\]/g;

  for (const line of lines) {
    const text = line.replace(timeExp, '').trim();
    let match;
    timeExp.lastIndex = 0;
    while ((match = timeExp.exec(line)) !== null) {
      const min = parseInt(match[1]);
      const sec = parseInt(match[2]);
      const ms = parseInt(match[3]);
      const time = min * 60 + sec + ms / (match[3].length === 2 ? 100 : 1000);
      result.push({ time, text });
    }
  }

  result.sort((a, b) => a.time - b.time);
  return result;
}

export function getLyricIndex(lyrics: LyricLine[], currentTime: number): number {
  for (let i = 0; i < lyrics.length; i++) {
    if (currentTime < lyrics[i].time) {
      return i - 1;
    }
  }
  return lyrics.length - 1;
}
