import { useState, useEffect } from "react";
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
}) {
  const [player, setPlayer] = useState(undefined);
  const [isPlaying, setPlaying] = useState(false);
  const [isActive, setActive] = useState(false);
  const [deviceId, setDeviceId] = useState(undefined);

  useEffect(() => {
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
  }, [accessToken]);

  useEffect(() => {
    if (!accessToken || !deviceId) return;
    spotifyApi.transferMyPlayback([deviceId]).then(
      () => {
        setActive(true);
      },
      (err) => {
        //if the user making the request is non-premium, a 403 FORBIDDEN response code will be returned
        console.log("Something went wrong!", err);
      }
    );
  }, [deviceId, spotifyApi, accessToken]);

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
    if (!accessToken || showAnswer || !isActive || isFirstPlay) return;
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

  // sync every 10s with actual time
  useEffect(() => {
    let syncInterval;
    if (showAnswer && isPlaying) {
      syncInterval = setInterval(() => {
        player.getCurrentState().then((state) => {
          setTime(state.position / 1000);
        });
      }, 10000);
    }
    return () => clearInterval(syncInterval);
  }, [player, isPlaying, showAnswer]);

  // timer of track
  useEffect(() => {
    var timer;
    const interval = 200;
    if (isPlaying)
      timer = setInterval(() => {
        setTime((prevTime) => prevTime + interval / 1000);
      }, interval);
    else if (
      !isPlaying &&
      (!showAnswer || Math.ceil(time) >= Math.round(track.duration_ms / 1000))
    )
      setTime(0);

    return () => clearInterval(timer);
  }, [isPlaying, showAnswer, time, track]);

  // seeks to start of track when time is added
  useEffect(() => {
    if (!accessToken || showAnswer || !isActive || isFirstPlay) return;
    player.pause();
    spotifyApi.seek(0);
  }, [
    timeValue,
    spotifyApi,
    player,
    accessToken,
    showAnswer,
    isActive,
    isFirstPlay,
  ]);

  const [seekRatio, setSeekRatio] = useState(null);
  const [isSeeking, setSeeking] = useState(false);

  useEffect(() => {
    if (!showAnswer || seekRatio === null || !isSeeking || !track) return;
    setPlaying(false);
    const newTime =
      seekRatio > 0.985 ? track.duration_ms : track.duration_ms * seekRatio;
    setTime(newTime / 1000);
    player.seek(Math.floor(newTime));
    setSeeking(false);
  }, [player, seekRatio, showAnswer, isSeeking, track]);

  const handleReset = () => {
    setTime(0);
    player.seek(0);
  };

  if (accessToken)
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
          disabled={!isActive}
          accessToken={accessToken}
          player={player}
          playFirstTrack={playFirstTrack}
          isFirstPlay={isFirstPlay}
          isPlaying={isPlaying}
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
          handleRight={showAnswer ? handleNext : handleShowAnswer}
        />
      </div>
    );
}
