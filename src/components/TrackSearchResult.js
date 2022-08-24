import React from "react";

export default function TrackSearchResult({ track, chooseAnswer }) {
  return (
    <div
      className="d-flex m-2 align-items-center"
      style={{ cursor: "pointer" }}
      onClick={() => chooseAnswer(track.pattern)}
    >
      <div
        style={{
          height: "48px",
          width: "48px",
          backgroundSize: "48px 48px",
          backgroundImage: `url(${track.albumUrl})`,
        }}
      />
      <div className="m-1">
        {track.title}
        <div className="text-muted">
          {track.artists.map((artist, index) => {
            return (
              artist.name + (index + 1 !== track.artists.length ? ", " : "")
            );
          })}
        </div>
      </div>
    </div>
  );
}
