import React from "react";

export default function Stats({
  gameState,
  metadataList,
  showAnswer,
  isMetadataLoading,
  songIndex,
  songPic,
  timeState,
  searchResults,
  score,
}) {
  return (
    <div
      className="d-flex flex-column justify-content-center align-items-center"
      style={{ textAlign: "center" }}
    >
      State: {gameState}
      <br />
      Title: {showAnswer ? searchResults[songIndex].title : ""}
      <br />
      Artist: {showAnswer ? searchResults[songIndex].artists[0].name : ""}
      <br />
      Album: {showAnswer ? searchResults[songIndex].album : ""}
      <br />
      <div
        style={{
          height: "300px",
          width: "300px",
          backgroundSize: "300px 300px",
          backgroundImage: `url(${
            showAnswer ? searchResults[songIndex].albumUrlMed : ""
          })`,
        }}
      />
      Seconds: {timeState.times[timeState.index]}s<div>Score: {score}</div>
    </div>
  );
}
