import { useState, useEffect, Fragment, useMemo } from "react";
import Player from "./Player";
import TrackSearchResult from "./TrackSearchResult";
import Results from "./Results";
import GuessBoxes from "./GuessBoxes";
import NoPremiumModal from "./NoPremiumModal";
import { Container, Form } from "react-bootstrap";

export default function Dashboard({
  isPremium,
  accessToken,
  spotifyApi,
  setStreak,
  setFails,
  setWins,
  pool,
  setPool,
  poolName,
}) {
  const [search, setSearch] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [playingTrack, setPlayingTrack] = useState();
  const [trackIndex, setTrackIndex] = useState();
  const [userAnswers, setUserAnswers] = useState([]);
  const [userAnswer, setUserAnswer] = useState(null);
  const [timeIndex, setTimeIndex] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);
  const times = useMemo(() => [1, 2, 4, 7, 11, 16], []);

  const handleAdd = () => {
    if (pool.length && !showAnswer) {
      setTimeIndex((prevIndex) => prevIndex + 1);
      setUserAnswers([...userAnswers, "skip"]);
    }
  };

  const handleNext = () => {
    if (pool.length === 0 || pool.length === 1) return;
    if (!showAnswer) {
      setStreak((prevStreak) => prevStreak - 1);
      setFails((prevFails) => prevFails + 1);
    }
    let poolClone = [...pool];
    poolClone.splice(trackIndex, 1);
    setPool(poolClone);
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
      if (userAnswer === pool[trackIndex].pattern) {
        setStreak((prevStreak) => (prevStreak < 0 ? 1 : prevStreak + 1));
        setShowAnswer(true);
        setWins((prevWins) => {
          var winsClone = [...prevWins];
          winsClone[timeIndex]++;
          return [...winsClone];
        });
      } else if (timeIndex === times.length - 1) {
        setStreak((prevStreak) => (prevStreak > 0 ? 0 : prevStreak - 1));
        setShowAnswer(true);
        setFails((prevState) => prevState + 1);
      } else {
        setTimeIndex(timeIndex + 1);
        setSearch("");
      }
      setUserAnswer(null);
      setUserAnswers((prevState) => [...prevState, userAnswer]);
    }
  }, [
    userAnswer,
    trackIndex,
    pool,
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
    if (pool.length) {
      // soft reset
      setTimeIndex(0);
      setShowAnswer(false);
      setUserAnswer(null);
      setUserAnswers([]);
      setSearch("");
      setBeatOffset(0);

      const idx = Math.floor(Math.random() * pool.length);
      setTrackIndex(idx);
      const nextTrack = pool[idx];
      setPlayingTrack(nextTrack);
      spotifyApi.getAudioAnalysisForTrack(nextTrack.id).then(
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
  }, [pool, spotifyApi]);

  // grabs search results based off user search
  useEffect(() => {
    if (search.length < 2) return setSearchResults([]);
    if (!accessToken) return;

    let cancel = false;
    spotifyApi.searchTracks(search).then((res) => {
      if (cancel) return;
      setSearchResults(
        res.body.tracks.items.map((track) => {
          return {
            artists: track.artists,
            pattern: (
              track.artists.map((artist) => {
                return artist.name;
              }) +
              " - " +
              track.name
            ).replace(",", " "),
            title: track.name,
            uri: track.uri,
            albumUrl: track.album.images[2].url,
          };
        })
      );
    });

    return () => (cancel = true);
  }, [search, accessToken, spotifyApi]);

  return (
    <Container id="dashboard">
      <div className="my-1">Pool: {poolName}</div>
      <div>Tracks Remaining: {pool.length}</div>
      {showAnswer ? (
        <Results
          won={userAnswer === pool[trackIndex].pattern}
          userAnswers={userAnswers}
          times={times}
          timeIndex={timeIndex}
          trackIndex={trackIndex}
          pool={pool}
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
            placeholder="Search for Track"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <div
            className="flex-grow-1 my-2 overflow-auto"
            style={{ height: "10vh", width: "100%" }}
          >
            {searchResults.length ? (
              searchResults
                .filter((track) => !userAnswers.includes(track.pattern))
                .map((track) => (
                  <TrackSearchResult
                    track={track}
                    key={track.uri}
                    chooseAnswer={setUserAnswer}
                  />
                ))
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
        times={times}
        timeIndex={timeIndex}
        handleShowAnswer={handleShowAnswer}
        handleAdd={handleAdd}
        handleNext={handleNext}
      />
      <NoPremiumModal show={!isPremium} />
    </Container>
  );
}
