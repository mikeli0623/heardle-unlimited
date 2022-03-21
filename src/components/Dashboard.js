import { useState, useEffect, Fragment, useContext } from "react";
import useAuth from "./useAuth";
import Player from "./Player";
import Stats from "./Stats";
import ModeContext from "./ModeContext";
import TrackSearchResult from "./TrackSearchResult";
import { Container, Form } from "react-bootstrap";
import SpotifyWebApi from "spotify-web-api-node";
import * as mmb from "music-metadata-browser";

const spotifyApi = new SpotifyWebApi({
  clientId: "cb09cd6fc8b14816adfcc582ec5698b2",
});

var a,
  timeoutID,
  metadataList = [];

export default function Dashboard({ code }) {
  const { mode, setMode } = useContext(ModeContext);
  const accessToken = useAuth(code);
  const [search, setSearch] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [playingTrack, setPlayingTrack] = useState();

  useEffect(() => {
    if (!accessToken) return;
    spotifyApi.setAccessToken(accessToken);
    setMode("spotify");
  }, [accessToken, setMode]);

  const [buttonState, setButtonState] = useState("Play");

  const [gameState, setGameState] = useState("thinking");

  const [songIndex, setSongIndex] = useState();

  const [songPic, setSongPic] = useState(null);

  const [userAnswer, setUserAnswer] = useState(null);

  const [audio, setAudio] = useState();

  const [audioFileList, setAudioFileList] = useState([]);

  const [timeState, setTimeState] = useState({
    times: [1, 2, 3, 5, 8, 13],
    index: 0,
  });

  useEffect(() => {
    if (a) {
      a.pause();
      a = null;
      setButtonState("Play");
    }
    if (audio) {
      a = new Audio(audio);
      a.onended = () => {
        setButtonState("Play");
      };
    }
  }, [audio]);

  useEffect(() => {
    if (audioFileList.length) {
      const idx = Math.floor(Math.random() * audioFileList.length);
      setSongIndex(idx);
      const nextSong = audioFileList[idx];
      setAudio(URL.createObjectURL(nextSong));
    }
  }, [audioFileList]);

  const handleAdd = () => {
    if (mode === "local") {
      if (a && !showAnswer) {
        setButtonState("Pause");
        setTimeState({ ...timeState, index: timeState.index + 1 });
        clearTimeout(timeoutID);
        a.pause();
        a.currentTime = 0;
        a.play();
        timeoutID = setTimeout(() => {
          a.pause();
          a.currentTime = 0;
          setButtonState("Play");
        }, 1000 * timeState.times[timeState.index + 1]);
      }
    } else {
      setTimeState({ ...timeState, index: timeState.index + 1 });
    }
  };

  const handleNext = () => {
    if (mode === "local") {
      if (a) {
        if (gameState !== "Won" && !showAnswer) setScore(score - 1);
        let audioListClone = [...audioFileList];
        audioListClone.splice(songIndex, 1);
        setAudioFileList(audioListClone);
        metadataList.splice(songIndex, 1);
        setGameState("thinking");
        setTimeState({ ...timeState, index: 0 });
        setShowAnswer(false);
        setUserAnswer(null);
      }
    } else {
      if (gameState !== "Won" && !showAnswer) setScore(score - 1);
      let searchResultsClone = [...searchResults];
      searchResultsClone.splice(songIndex, 1);
      setSearchResults(searchResultsClone);
      setGameState("thinking");
      setTimeState({ ...timeState, index: 0 });
      setShowAnswer(false);
      setUserAnswer(null);
    }
  };

  const handlePlay = () => {
    if (a) {
      if (buttonState === "Play") {
        a.play();
        setButtonState("Pause");
        if (!showAnswer) {
          clearTimeout(timeoutID);
          timeoutID = setTimeout(() => {
            a.pause();
            a.currentTime = 0;
            setButtonState("Play");
          }, 1000 * timeState.times[timeState.index]);
        }
      } else {
        clearTimeout(timeoutID);
        a.pause();
        a.currentTime = 0;
        setButtonState("Play");
      }
    }
  };

  const [isMetadataLoading, setIsMetadataLoading] = useState(false);

  const [metadataLoaded, setMetadataLoaded] = useState(0);

  const handleUpload = async (e) => {
    metadataList = [];
    if (e.target.files.length !== 0) {
      var files = e.target.files;
      files = [...files].filter((file) => file.type === "audio/mpeg");
      setAudioFileList(files);
      setIsMetadataLoading(true);
      for (var file of files) metadataList.push(await parseFile(file));
    }
  };

  const parseFile = async (file) => {
    return mmb.parseBlob(file, { native: true }).then((metadata) => {
      setMetadataLoaded((prevMetadataLoaded) => prevMetadataLoaded + 1);
      return metadata;
    });
  };

  useEffect(() => {
    if (
      !isMetadataLoading &&
      metadataList.length > 0 &&
      metadataList[songIndex].common.picture
    )
      setSongPic(
        URL.createObjectURL(
          new Blob([metadataList[songIndex].common.picture[0].data.buffer], {
            type: "image/png",
          })
        )
      );
  }, [isMetadataLoading, songIndex]);

  useEffect(() => {
    if (metadataLoaded >= audioFileList.length) setIsMetadataLoading(false);
  }, [metadataLoaded, audioFileList]);

  const [score, setScore] = useState(0);

  useEffect(() => {
    if (mode === "local" && metadataList && userAnswer) {
      if (
        userAnswer.title.toLowerCase() ===
          metadataList[songIndex].common.title.toLowerCase() &&
        userAnswer.artists[0].name.toLowerCase() ===
          metadataList[songIndex].common.artist.toLowerCase()
      ) {
        setGameState("Won");
      } else setGameState("Lost");
      setShowAnswer(true);
    }
    if (mode === "spotify" && userAnswer) {
      if (searchResults[songIndex] === userAnswer) setGameState("Won");
      else setGameState("Lost");
      setShowAnswer(true);
    }
  }, [userAnswer, songIndex, mode, playingTrack, searchResults]);

  const [showAnswer, setShowAnswer] = useState(false);

  useEffect(() => {
    if (gameState === "Won") setScore((prevScore) => prevScore + 1);
    else if (gameState === "Lost") setScore((prevScore) => prevScore - 1);
  }, [gameState]);

  const searchList = () => {
    if (metadataList) {
      return metadataList.map((metadata, index) => {
        return {
          artists: [{ name: metadata.common.artist }],
          title: metadata.common.title,
          uri: URL.createObjectURL(audioFileList[index]),
          albumUrl: metadata.common.picture
            ? URL.createObjectURL(
                new Blob([metadata.common.picture[0].data.buffer], {
                  type: "image/png",
                })
              )
            : null,
        };
      });
    } else return null;
  };

  const handleShowAnswer = () => {
    if (mode === "local") {
      if (a) {
        setShowAnswer(true);
        if (gameState !== "Won") setGameState("Lost");
      }
    } else {
      setShowAnswer(true);
      if (gameState !== "Won") setGameState("Lost");
    }
  };

  const chooseAnswer = (track) => {
    setUserAnswer(track);
  };

  useEffect(() => {
    if (searchResults.length) {
      const idx = Math.floor(Math.random() * searchResults.length);
      setSongIndex(idx);
      const nextSong = searchResults[idx];
      setPlayingTrack(nextSong);
    }
  }, [searchResults]);

  const chooseSavedTracks = () => {
    if (!accessToken) return;
    spotifyApi.getMySavedTracks().then(
      (res) => {
        console.log(res.body.items);
        setSearchResults(
          res.body.items.map((item) => {
            const smallestAlbumImage = item.track.album.images.reduce(
              (smallest, image) => {
                if (image.height < smallest.height) return image;
                return smallest;
              },
              item.track.album.images[0]
            );
            const mediumAlbumImage = item.track.album.images.reduce(
              (comp, image) => {
                if (image.height === 300) return image;
                return comp;
              },
              item.track.album.images[0]
            );

            return {
              artists: item.track.artists,
              title: item.track.name,
              uri: item.track.uri,
              album: item.track.album.name,
              albumUrlMed: mediumAlbumImage.url,
              albumUrlSmall: smallestAlbumImage.url,
            };
          })
        );
      },
      (err) => {
        console.log("Something went wrong!", err);
      }
    );
  };

  const chooseSavedAlbums = () => {
    if (!accessToken) return;
    spotifyApi.getMySavedAlbums().then(
      (data) => {
        console.log(data.body.items);
      },
      (err) => {
        console.log("Something went wrong!", err);
      }
    );
  };

  return (
    <Container className="d-flex flex-column py-2" style={{ height: "100vh" }}>
      <Stats
        gameState={gameState}
        metadataList={metadataList}
        showAnswer={showAnswer}
        isMetadataLoading={isMetadataLoading}
        songIndex={songIndex}
        songPic={songPic}
        timeState={timeState}
        score={score}
        searchResults={searchResults}
      />
      <Form.Control
        type="search"
        placeholder="Search Songs/Artists"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />
      {!isMetadataLoading && (
        <div className="flex-grow-1 my-2" style={{ overflowY: "auto" }}>
          {mode === "local"
            ? searchList()?.map((track) => (
                <TrackSearchResult
                  track={track}
                  key={track.uri}
                  chooseAnswer={chooseAnswer}
                />
              ))
            : searchResults.map((track) => (
                <TrackSearchResult
                  track={track}
                  key={track.uri}
                  chooseAnswer={chooseAnswer}
                />
              ))}
        </div>
      )}
      {/* <div className="flex-grow-1 my-2" style={{ overflowY: "auto" }}>
        {searchResults.map((track) => (
          <TrackSearchResult
            track={track}
            key={track.uri}
            chooseAnswer={chooseAnswer}
          />
        ))}
      </div> */}
      <button onClick={chooseSavedTracks}>Saved Tracks</button>
      {/* <button onClick={chooseSavedAlbums}>Saved Albums</button> */}
      <button
        onClick={handleAdd}
        disabled={
          isMetadataLoading ||
          timeState.index + 1 === timeState.times.length ||
          showAnswer
        }
      >
        Add Time
      </button>
      <button
        onClick={handleNext}
        disabled={
          isMetadataLoading ||
          audioFileList.length === 1 ||
          searchResults.length === 1
        }
      >
        Next Song
      </button>
      <button
        onClick={handleShowAnswer}
        disabled={isMetadataLoading || showAnswer}
      >
        Show Answer
      </button>
      {/* <input
        type="file"
        onChange={handleUpload}
        onClick={() => {
          if (a) {
            a.pause();
            a.currentTime = 0;
            setButtonState("Play");
          }
        }}
        webkitdirectory="true"
        multiple
      /> */}
      {isMetadataLoading && (
        <Fragment>
          <label htmlFor="metadata">
            Loading {metadataLoaded} of {audioFileList.length}
          </label>
          <progress
            id="metadata"
            value={metadataLoaded}
            max={audioFileList.length}
          />
        </Fragment>
      )}
      <Player
        accessToken={accessToken}
        trackUri={playingTrack?.uri}
        buttonState={buttonState}
        handlePlay={handlePlay}
        timeValue={timeState.times[timeState.index]}
        spotifyApi={spotifyApi}
        showAnswer={showAnswer}
      />
    </Container>
  );
}
