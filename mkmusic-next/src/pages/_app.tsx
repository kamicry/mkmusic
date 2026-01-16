import "@/styles/globals.css";
import "@/styles/player.css";
import "@/styles/small.css";
import "@/styles/jquery.mCustomScrollbar.min.css";
import "@/styles/layer/layer.css";
import "@/styles/search-panel.css";
import "@/styles/music-info-panel.css";
import "@/styles/music-list.css";
import "@/styles/lyric-mobile-fix.css";
import type { AppProps } from "next/app";
import { PlayerProvider } from "../contexts/PlayerContext";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <PlayerProvider>
      <Component {...pageProps} />
    </PlayerProvider>
  );
}
