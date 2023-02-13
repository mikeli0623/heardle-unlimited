import { useState, useEffect, useContext } from "react";
import ModeContext from "./ModeContext";
import PlayerBar from "./PlayerBar";
import PlayerButtons from "./PlayerButtons";

export default function Player({
  accessToken,
  track,
  timeValue,
  spotifyApi,
  showAnswer,
  offset,
  timeIndex,
  times,
  handleShowAnswer,
  handleAdd,
  handleNext,
  audio,
}) {
  const { mode } = useContext(ModeContext);
  const [player, setPlayer] = useState(undefined);
  const [isPlaying, setPlaying] = useState(false);
  const [isActive, setActive] = useState(false);
  const [deviceId, setDeviceId] = useState(undefined);

  useEffect(() => {
    if (audio) {
      audio.volume = 0.5;
      audio.onended = () => {
        setPlaying(false);
      };
    }
  }, [audio]);

  const handleLocalPlay = () => {
    if (audio) {
      if (!isPlaying) {
        audio.play();
        setPlaying(true);
      } else {
        audio.pause();
        if (!showAnswer) audio.currentTime = 0;
        setPlaying(false);
      }
    }
  };

  const handleSpotifyPlay = () => {
    if (accessToken && isActive) {
      if (isFirstPlay) {
        playFirstTrack();
      } else player.togglePlay();
    }
  };

  useEffect(() => {
    if (showAnswer || mode !== "local" || !audio) return;
    let autoStop;
    if (isPlaying) {
      autoStop = setTimeout(() => {
        audio.pause();
        audio.currentTime = 0;
        setPlaying(false);
      }, timeValue * 1000);
    } else {
      setPlaying(false);
      audio.currentTime = 0;
    }
    return () => clearTimeout(autoStop);
  }, [mode, isPlaying, timeValue, showAnswer, audio]);

  useEffect(() => {
    if (mode !== "premium") return;
    const script = document.createElement("script");
    script.src = "https://sdk.scdn.co/spotify-player.js";
    script.async = true;

    document.body.appendChild(script);

    window.onSpotifyWebPlaybackSDKReady = () => {
      const player = new window.Spotify.Player({
        name: "Heardle Unlimited",
        getOAuthToken: (cb) => {
          cb(accessToken);
        },
        volume: 0.5,
      });

      setPlayer(player);

      player.addListener("ready", ({ device_id }) => {
        setDeviceId(device_id);
      });

      player.addListener("not_ready", () => {
        setDeviceId(undefined);
      });

      player.addListener("player_state_changed", (state) => {
        if (!state) {
          return;
        }
        setPlaying(!state.paused);

        player.getCurrentState().then((state) => {
          !state ? setActive(false) : setActive(true);
        });
      });

      player.connect();
    };
  }, [mode, accessToken]);

  useEffect(() => {
    if (mode !== "premium" || !accessToken || !deviceId) return;
    spotifyApi.transferMyPlayback([deviceId]).then(
      () => {
        setActive(true);
      },
      (err) => {
        //if the user making the request is non-premium, a 403 FORBIDDEN response code will be returned
        console.log("Something went wrong!", err);
      }
    );
  }, [mode, deviceId, spotifyApi, accessToken]);

  const [isFirstPlay, setFirstPlay] = useState(true);

  const playFirstTrack = () => {
    spotifyApi
      .play({
        uris: [track.uri],
      })
      .then(
        () => {
          setFirstPlay(false);
        },
        (err) => {
          //if the user making the request is non-premium, a 403 FORBIDDEN response code will be returned
          console.log("Something went wrong!", err);
        }
      );
  };

  // if the track uri changes, reset first play state
  useEffect(() => {
    setFirstPlay(true);
  }, [track]);

  useEffect(() => {
    if (
      mode !== "premium" ||
      !accessToken ||
      showAnswer ||
      !isActive ||
      isFirstPlay
    )
      return;
    var autoStop;
    if (isPlaying) {
      autoStop = setTimeout(() => {
        player.pause();
        setPlaying(false);
        spotifyApi.seek(0);
      }, (timeValue + offset) * 1000);
    } else {
      setPlaying(false);
      spotifyApi.seek(0);
    }
    return () => clearTimeout(autoStop);
  }, [
    mode,
    player,
    isPlaying,
    timeValue,
    offset,
    spotifyApi,
    accessToken,
    showAnswer,
    isActive,
    isFirstPlay,
  ]);

  const [time, setTime] = useState(0);

  // timer of track (we dont update the time with the actual track time for spotify as it would call the api too frequently)
  useEffect(() => {
    var timer;
    const interval = 200;
    if (isPlaying)
      timer = setInterval(() => {
        if (mode === "premium")
          setTime((prevTime) => prevTime + interval / 1000);
        else if (mode === "local") setTime(audio.currentTime);
      }, interval);
    else if (
      !isPlaying &&
      (!showAnswer || Math.ceil(time) >= Math.round(track.duration_ms / 1000))
    )
      setTime(0);

    return () => clearInterval(timer);
  }, [mode, isPlaying, showAnswer, time, track, audio]);

  // premium only: sync every 10s with actual time
  useEffect(() => {
    let syncInterval;
    if (mode !== "premium") return;
    if (showAnswer && isPlaying) {
      syncInterval = setInterval(() => {
        player.getCurrentState().then((state) => {
          setTime(state.position / 1000);
        });
      }, 10000);
    }
    return () => clearInterval(syncInterval);
  }, [mode, player, isPlaying, showAnswer]);

  // seeks to start of track when time is added
  useEffect(() => {
    if (showAnswer) return;
    if (mode === "premium") {
      if (accessToken && isActive && !isFirstPlay) {
        player.pause();
        spotifyApi.seek(0);
      }
    } else if (mode === "local") {
      if (audio) {
        audio.pause();
        audio.currentTime = 0;
        setPlaying(false);
      }
    }
  }, [
    mode,
    timeValue,
    spotifyApi,
    player,
    accessToken,
    showAnswer,
    audio,
    isActive,
    isFirstPlay,
  ]);

  const [seekRatio, setSeekRatio] = useState(null);
  const [isSeeking, setSeeking] = useState(false);

  // handles seeking
  useEffect(() => {
    if (!showAnswer || seekRatio === null || !isSeeking || !track) return;
    // setPlaying(false);
    const newTime =
      seekRatio > 0.985 ? track.duration_ms : track.duration_ms * seekRatio;
    setTime(newTime / 1000);
    if (mode === "premium") player.seek(Math.floor(newTime));
    else if (mode === "local") audio.currentTime = Math.floor(newTime / 1000);
    setSeeking(false);
  }, [mode, player, seekRatio, showAnswer, isSeeking, track, audio]);

  const handleReset = () => {
    setTime(0);
    if (mode === "premium") player.seek(0);
    else if (mode === "local") audio.currentTime = 0;
  };

  return (
    <div id="player">
      <PlayerBar
        time={time}
        totalTime={
          showAnswer
            ? Math.round(track.duration_ms / 1000)
            : times[times.length - 1] + offset
        }
        times={times}
        timeIndex={timeIndex}
        offset={offset}
        showAnswer={showAnswer}
        setSeekRatio={setSeekRatio}
        setSeeking={setSeeking}
      />
      <PlayerButtons
        disabled={mode === "premium" ? !isActive : audio === null}
        player={mode === "premium" ? player : audio}
        isPlaying={isPlaying}
        setPlaying={setPlaying}
        addedTime={times[timeIndex + 1] - times[timeIndex]}
        surrender={timeIndex + 1 === times.length}
        freePlay={showAnswer}
        handleLeft={
          showAnswer
            ? handleReset
            : timeIndex + 1 === times.length
            ? handleShowAnswer
            : handleAdd
        }
        handleMid={mode === "premium" ? handleSpotifyPlay : handleLocalPlay}
        handleNext={handleNext}
        handleShowAnswer={handleShowAnswer}
      />
    </div>
  );
}
