import React from "react";

export default function TrackSearchResult({ track, chooseAnswer }) {
  const handleSelect = () => {
    chooseAnswer(track);
  };

  return (
    <div
      className="d-flex m-2 align-items-center"
      style={{ cursor: "pointer" }}
      onClick={handleSelect}
    >
      <div
        style={{
          height: "64px",
          width: "64px",
          backgroundSize: "64px 64px",
          backgroundImage: `url(${track.albumUrlSmall})`,
        }}
      />
      <div className="m-2">
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
