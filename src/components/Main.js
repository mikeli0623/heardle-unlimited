// import { useState, useEffect } from "react";

// import Player from "./Player";
// import { Container } from "react-bootstrap";
// import Dashboard from "./Dashboard";

// export default function Main({ accessToken, spotifyApi }) {
//   const [search, setSearch] = useState("");
//   const [searchResults, setSearchResults] = useState([]);
//   const [playingTrack, setPlayingTrack] = useState();
//   const [gameState, setGameState] = useState("thinking");
//   const [songIndex, setSongIndex] = useState();
//   const [userAnswer, setUserAnswer] = useState(null);
//   const times = [1, 2, 4, 7, 11, 16];
//   const [timeIndex, setTimeIndex] = useState(0);
//   const [streak, setStreak] = useState(0);
//   const [showAnswer, setShowAnswer] = useState(false);

//   const handleAdd = () => {
//     if (searchResults.length) setTimeIndex((prevIndex) => prevIndex + 1);
//   };

//   const handleNext = () => {
//     if (searchResults.length === 0 || searchResults.length === 1) return;
//     if (gameState !== "Won" && !showAnswer) setStreak(streak - 1);
//     let searchResultsClone = [...searchResults];
//     searchResultsClone.splice(songIndex, 1);
//     setSearchResults(searchResultsClone);
//     setGameState("thinking");
//     setTimeIndex(0);
//     setShowAnswer(false);
//     setUserAnswer(null);
//     setSearch("");
//     setBeatOffset(0);
//   };

//   // determines outcome of game based off user answer
//   useEffect(() => {
//     if (userAnswer) {
//       if (searchResults[songIndex] === userAnswer) {
//         setGameState("Won");
//         setStreak((prevStreak) => (prevStreak < 0 ? 1 : prevStreak + 1));
//       } else {
//         setGameState("Lost");
//         setStreak((prevStreak) => (prevStreak > 0 ? 0 : prevStreak - 1));
//       }
//       setShowAnswer(true);
//     }
//   }, [userAnswer, songIndex, playingTrack, searchResults]);

//   const handleShowAnswer = () => {
//     if (showAnswer) return;
//     setShowAnswer(true);
//     setUserAnswer("z");
//   };

//   const [beatOffset, setBeatOffset] = useState(0);

//   useEffect(() => {
//     if (searchResults.length) {
//       // const idx = Math.floor(Math.random() * searchResults.length);
//       const idx = 0;
//       setSongIndex(idx);
//       const nextSong = searchResults[idx];
//       setPlayingTrack(nextSong);
//       spotifyApi.getAudioAnalysisForTrack(nextSong.id).then(
//         (res) => {
//           if (res.body.beats[0].start > 1.0) {
//             setBeatOffset(res.body.beats[0].start);
//           }
//         },
//         (err) => {
//           console.log("Something went wrong!", err);
//         }
//       );
//     }
//   }, [searchResults, spotifyApi]);

//   return (
//     <Container id="main">
//       <Dashboard
//         spotifyApi={spotifyApi}
//         accessToken={accessToken}
//         showAnswer={showAnswer}
//         gameState={gameState}
//         songIndex={songIndex}
//         searchResults={searchResults}
//         setSearchResults={setSearchResults}
//         streak={streak}
//         times={times}
//         timeIndex={timeIndex}
//         search={search}
//         setSearch={setSearch}
//         setUserAnswer={setUserAnswer}
//       />
//       <Player
//         accessToken={accessToken}
//         trackUri={playingTrack?.uri}
//         timeValue={times[timeIndex]}
//         spotifyApi={spotifyApi}
//         offset={beatOffset}
//         showAnswer={showAnswer}
//         totalTime={
//           showAnswer
//             ? playingTrack.duration
//             : times[timeIndex] + Math.round(beatOffset)
//         }
//         timeIndex={timeIndex}
//         times={times}
//         handleShowAnswer={handleShowAnswer}
//         handleAdd={handleAdd}
//         handleNext={handleNext}
//       />
//     </Container>
//   );
// }
