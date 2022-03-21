import { useState, useEffect, useContext } from "react";
import SpotifyPlayer from "react-spotify-web-playback";
import ModeContext from "./ModeContext";

export default function Player({
  accessToken,
  trackUri,
  buttonState,
  handlePlay,
  timeValue,
  spotifyApi,
  showAnswer,
}) {
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    var autoStop;
    if (!accessToken || showAnswer) return;
    if (isPlaying) {
      autoStop = setInterval(() => {
        setIsPlaying(false);
        spotifyApi.pause();
        spotifyApi.seek(0);
      }, timeValue * 1000);
    } else {
      setIsPlaying(false);
      spotifyApi.seek(0);
    }
    return () => clearInterval(autoStop);
  }, [isPlaying, timeValue, spotifyApi, accessToken, showAnswer]);

  const { mode } = useContext(ModeContext);

  return mode === "spotify" ? (
    <SpotifyPlayer
      styles={{ bgColor: "rgba(255, 0, 0, 0)", color: "white" }}
      token={accessToken}
      callback={(state) => setIsPlaying(state.isPlaying)}
      play={isPlaying}
      uris={trackUri ? [trackUri] : []}
    />
  ) : (
    <button onClick={handlePlay}>{buttonState}</button>
  );
}
