import { useState, useEffect } from "react";
import PlayerBar from "./PlayerBar";
import PlayerButtons from "./PlayerButtons";

export default function Player({
  accessToken,
  trackUri,
  timeValue,
  spotifyApi,
  totalTime,
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

      player.addListener("not_ready", ({ device_id }) => {
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
        uris: [trackUri],
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
  }, [trackUri]);

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

  // timer of song
  useEffect(() => {
    var timer;
    const interval = 200;
    if (isPlaying)
      timer = setInterval(() => {
        setTime((prevTime) => prevTime + interval / 1000);
      }, interval);
    else if (!isPlaying && (!showAnswer || Math.round(time) >= totalTime))
      setTime(0);

    return () => clearInterval(timer);
  }, [isPlaying, showAnswer, time, totalTime]);

  // seeks to start of song when time is added
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

  if (accessToken)
    return (
      <div id="player">
        <PlayerBar
          time={time}
          totalTime={showAnswer ? totalTime : times[times.length - 1] + offset}
          showAnswer={showAnswer}
          times={times}
          timeIndex={timeIndex}
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
          handleShowAnswer={handleShowAnswer}
          handleAdd={handleAdd}
          handleNext={handleNext}
        />
      </div>
    );
}
