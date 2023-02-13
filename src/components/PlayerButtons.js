export default function PlayerButtons({
  disabled,
  player,
  isPlaying,
  setPlaying,
  surrender,
  freePlay,
  addedTime,
  handleLeft,
  handleMid,
  handleNext,
  handleShowAnswer,
}) {
  return (
    <div id="player-buttons-container">
      {freePlay ? (
        <div
          className="d-flex justify-content-center align-items-center chevron-container"
          style={{
            rotate: "180deg",
          }}
        >
          <div
            className="player-icon chevron-icon"
            onClick={() => {
              if (!disabled) handleLeft();
            }}
          />
        </div>
      ) : surrender ? (
        <div
          className="player-icon"
          style={{
            backgroundImage: "url(../assets/surrender.png",
          }}
          onClick={() => {
            if (!disabled) handleLeft();
          }}
        />
      ) : (
        <div
          className="player-icon add-time-icon"
          onClick={() => {
            if (!disabled) {
              handleLeft();
            }
          }}
        >
          +{addedTime}s
        </div>
      )}
      <div
        id="player-play-button"
        className={`player-icon ${isPlaying ? "bounce" : ""}`}
        style={{
          backgroundImage: `url(../assets/${
            isPlaying ? "pause.svg" : "play.svg"
          })`,
        }}
        onClick={handleMid}
      />
      <div className="d-flex justify-content-center align-items-center chevron-container">
        <div
          className="player-icon chevron-icon"
          onClick={() => {
            if (!disabled) {
              if (freePlay) {
                player.pause();
                setPlaying(false);
                handleNext();
              } else handleShowAnswer();
            }
          }}
        />
      </div>
    </div>
  );
}
