import { useState, useEffect, Fragment, useMemo, useContext } from "react";
import ModeContext from "./ModeContext";
import Player from "./Player";
import TrackSearchResult from "./TrackSearchResult";
import Results from "./Results";
import GuessBoxes from "./GuessBoxes";
import Settings from "./Settings";
import { Container, Form } from "react-bootstrap";
import { matchSorter } from "match-sorter";
import { countryCodes, decadeCodes } from "./data";

export default function Dashboard({
  accessToken,
  spotifyApi,
  showSettings,
  setShowSettings,
  username,
  setStreak,
  setFails,
  setWins,
}) {
  const { mode } = useContext(ModeContext);
  const [search, setSearch] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [playingTrack, setPlayingTrack] = useState();
  const [gameState, setGameState] = useState("thinking");
  const [songIndex, setSongIndex] = useState();
  const [userAnswers, setUserAnswers] = useState([]);
  const [userAnswer, setUserAnswer] = useState(null);
  const [timeIndex, setTimeIndex] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);
  const times = useMemo(() => [1, 2, 4, 7, 11, 16], []);

  const [activeSavedPlaylist, setActiveSavedPlaylist] = useState(null);
  const [activeCountry, setActiveCountry] = useState("Global");
  const [activeDecade, setActiveDecade] = useState(null);

  const handleAdd = () => {
    if (searchResults.length && !showAnswer) {
      setTimeIndex((prevIndex) => prevIndex + 1);
      setUserAnswers([...userAnswers, "skip"]);
    }
  };

  const handleNext = () => {
    if (searchResults.length === 0 || searchResults.length === 1) return;
    if (gameState !== "Won" && !showAnswer) {
      setStreak((prevStreak) => prevStreak - 1);
      setFails((prevFails) => prevFails + 1);
    }
    let searchResultsClone = [...searchResults];
    searchResultsClone.splice(songIndex, 1);
    setSearchResults(searchResultsClone);
    setGameState("thinking");
    setTimeIndex(0);
    setShowAnswer(false);
    setUserAnswer(null);
    setUserAnswers([]);
    setSearch("");
    setBeatOffset(0);
  };

  // determines outcome of game based off user answer
  useEffect(() => {
    if (userAnswer) {
      if (searchResults[songIndex] === userAnswer) {
        setGameState("Won");
        setStreak((prevStreak) => (prevStreak < 0 ? 1 : prevStreak + 1));
        setShowAnswer(true);
        setWins((prevWins) => {
          var winsClone = [...prevWins];
          winsClone[timeIndex]++;
          return [...winsClone];
        });
      } else if (timeIndex === times.length - 1) {
        setGameState("Lost");
        setStreak((prevStreak) => (prevStreak > 0 ? 0 : prevStreak - 1));
        setShowAnswer(true);
        setFails((prevState) => prevState + 1);
      } else {
        setTimeIndex(timeIndex + 1);
        setSearch("");
      }
      setUserAnswer(null);
      setUserAnswers((prevState) => [...prevState, userAnswer.pattern]);
    }
  }, [
    userAnswer,
    songIndex,
    searchResults,
    times,
    timeIndex,
    setWins,
    setFails,
    setStreak,
  ]);

  const handleShowAnswer = () => {
    if (showAnswer) return;
    setShowAnswer(true);
    setUserAnswer("_");
  };

  const [beatOffset, setBeatOffset] = useState(0);

  useEffect(() => {
    spotifyApi.getPlaylist("37i9dQZEVXbMDoHDwVN2tF").then(
      (res) => {
        setSearchResults(
          res.body.tracks.items.map((item) => {
            return {
              artists: item.track.artists,
              title: item.track.name,
              pattern: (
                item.track.artists.map((artist) => {
                  return artist.name;
                }) +
                " - " +
                item.track.name
              ).replace(",", " "),
              uri: item.track.uri,
              id: item.track.id,
              album: item.track.album.name,
              albumUrlLarge: item.track.album.images[0].url,
              albumUrlMed: item.track.album.images[1].url,
              albumUrlSmall: item.track.album.images[2].url,
              duration: Math.round(item.track.duration_ms / 1000),
            };
          })
        );
      },
      (err) => {
        console.log("Something went wrong!", err);
      }
    );
  }, [spotifyApi]);

  useEffect(() => {
    if (searchResults.length) {
      // soft reset
      setGameState("thinking");
      setTimeIndex(0);
      setShowAnswer(false);
      setUserAnswer(null);
      setUserAnswers([]);
      setSearch("");
      setBeatOffset(0);

      const idx = Math.floor(Math.random() * searchResults.length);
      setSongIndex(idx);
      const nextSong = searchResults[idx];
      setPlayingTrack(nextSong);
      spotifyApi.getAudioAnalysisForTrack(nextSong.id).then(
        (res) => {
          if (res.body.beats[0].start > 1.0) {
            setBeatOffset(res.body.beats[0].start);
          }
        },
        (err) => {
          console.log("Something went wrong!", err);
        }
      );
    }
  }, [searchResults, spotifyApi]);

  const [savedPlaylists, setSavedPlaylists] = useState([]);

  // grab user info
  useEffect(() => {
    if (username) {
      spotifyApi.getUserPlaylists(username, { limit: 50 }).then(
        (res) => {
          let obj = {};
          res.body.items.forEach((playlist) => (obj[playlist.name] = playlist));
          setSavedPlaylists(obj);
        },
        (err) => {
          console.log("Something went wrong!", err);
        }
      );
    }
  }, [username, spotifyApi]);

  useEffect(() => {
    if (!activeCountry) return;
    spotifyApi.getPlaylist(countryCodes[activeCountry]).then(
      (res) => {
        setSearchResults(
          res.body.tracks.items.map((item) => {
            return {
              artists: item.track.artists,
              title: item.track.name,
              pattern: (
                item.track.artists.map((artist) => {
                  return artist.name;
                }) +
                " - " +
                item.track.name
              ).replace(",", " "),
              uri: item.track.uri,
              id: item.track.id,
              album: item.track.album.name,
              albumUrlLarge: item.track.album.images[0].url,
              albumUrlMed: item.track.album.images[1].url,
              albumUrlSmall: item.track.album.images[2].url,
              duration: Math.round(item.track.duration_ms / 1000),
            };
          })
        );
      },
      (err) => {
        console.log("Something went wrong!", err);
      }
    );
  }, [spotifyApi, activeCountry, setSearchResults]);

  useEffect(() => {
    if (!activeSavedPlaylist || mode === "guest") return;
    spotifyApi.getPlaylist(savedPlaylists[activeSavedPlaylist].id).then(
      (res) => {
        setSearchResults(
          res.body.tracks.items.map((item) => {
            return {
              artists: item.track.artists,
              title: item.track.name,
              pattern: (
                item.track.artists.map((artist) => {
                  return artist.name;
                }) +
                " - " +
                item.track.name
              ).replace(",", " "),
              uri: item.track.uri,
              id: item.track.id,
              album: item.track.album.name,
              albumUrlLarge: item.track.album.images[0].url,
              albumUrlMed: item.track.album.images[1].url,
              albumUrlSmall: item.track.album.images[2].url,
              duration: Math.round(item.track.duration_ms / 1000),
            };
          })
        );
      },
      (err) => {
        console.log("Something went wrong!", err);
      }
    );
  }, [spotifyApi, activeSavedPlaylist, setSearchResults, savedPlaylists, mode]);

  useEffect(() => {
    if (!activeDecade) return;
    spotifyApi.getPlaylist(decadeCodes[activeDecade]).then(
      (res) => {
        setSearchResults(
          res.body.tracks.items.map((item) => {
            return {
              artists: item.track.artists,
              title: item.track.name,
              pattern: (
                item.track.artists.map((artist) => {
                  return artist.name;
                }) +
                " - " +
                item.track.name
              ).replace(",", " "),
              uri: item.track.uri,
              id: item.track.id,
              album: item.track.album.name,
              albumUrlLarge: item.track.album.images[0].url,
              albumUrlMed: item.track.album.images[1].url,
              albumUrlSmall: item.track.album.images[2].url,
              duration: Math.round(item.track.duration_ms / 1000),
            };
          })
        );
      },
      (err) => {
        console.log("Something went wrong!", err);
      }
    );
  }, [spotifyApi, activeDecade, setSearchResults]);

  return (
    <Container id="dashboard">
      {showSettings ? (
        <Settings
          spotifyApi={spotifyApi}
          setSearchResults={setSearchResults}
          close={() => setShowSettings(false)}
          savedPlaylists={savedPlaylists}
          activeSavedPlaylist={activeSavedPlaylist}
          setActiveSavedPlaylist={setActiveSavedPlaylist}
          activeCountry={activeCountry}
          setActiveCountry={setActiveCountry}
          activeDecade={activeDecade}
          setActiveDecade={setActiveDecade}
        />
      ) : showAnswer ? (
        <Results
          gameState={gameState}
          userAnswers={userAnswers}
          times={times}
          timeIndex={timeIndex}
          songIndex={songIndex}
          searchResults={searchResults}
        />
      ) : (
        <Fragment>
          <GuessBoxes
            times={times}
            timeIndex={timeIndex}
            userAnswers={userAnswers}
          />
          <Form.Control
            type="search"
            placeholder="Search Songs/Artists"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <div
            className="flex-grow-1 my-2 overflow-auto"
            style={{ height: "10vh" }}
          >
            {search.length > 1 ? (
              matchSorter(searchResults, search, { keys: ["pattern"] }).map(
                (track) => (
                  <TrackSearchResult
                    track={track}
                    key={track.uri}
                    chooseAnswer={setUserAnswer}
                  />
                )
              )
            ) : (
              <></>
            )}
          </div>
        </Fragment>
      )}
      <Player
        accessToken={accessToken}
        trackUri={playingTrack?.uri}
        timeValue={times[timeIndex]}
        spotifyApi={spotifyApi}
        offset={beatOffset}
        showAnswer={showAnswer}
        totalTime={
          showAnswer
            ? playingTrack.duration
            : times[timeIndex] + Math.round(beatOffset)
        }
        timeIndex={timeIndex}
        times={times}
        handleShowAnswer={handleShowAnswer}
        handleAdd={handleAdd}
        handleNext={handleNext}
      />
    </Container>
  );
}
