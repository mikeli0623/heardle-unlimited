export default function PlayerButtons({
  disabled,
  accessToken,
  player,
  playFirstTrack,
  isFirstPlay,
  isPlaying,
  surrender,
  freePlay,
  addedTime,
  handleLeft,
  handleRight,
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
              if (!disabled) {
                handleLeft();
              }
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
            if (!disabled) handleLeft();
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
        onClick={() => {
          if (accessToken && !disabled) {
            if (isFirstPlay) {
              playFirstTrack();
            } else player.togglePlay();
          }
        }}
      />
      <div className="d-flex justify-content-center align-items-center chevron-container">
        <div
          className="player-icon chevron-icon"
          onClick={() => {
            if (!disabled) {
              player.pause();
              handleRight();
            }
          }}
        />
      </div>
    </div>
  );
}
