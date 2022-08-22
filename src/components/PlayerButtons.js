const PlayerIcon = ({
  height,
  width,
  action,
  onClick,
  backgroundWidth = width,
}) => {
  return (
    <div
      className="player-icon"
      style={{
        height: height,
        width: width,
        backgroundSize: `${backgroundWidth}px ${height}px`,
        backgroundRepeat: "no-repeat",
        backgroundPosition: "center",
        backgroundImage: `url(../assets/${action}.png`,
      }}
      onClick={onClick}
    />
  );
};

export default function PlayerButtons({
  disabled,
  accessToken,
  player,
  playFirstTrack,
  isFirstPlay,
  isPlaying,
  surrender,
  addedTime,
  handleShowAnswer,
  handleAdd,
  handleNext,
}) {
  return (
    <div id="player-buttons-container">
      {surrender ? (
        <PlayerIcon
          height={32}
          backgroundWidth={32}
          width={55}
          action={"surrender"}
          onClick={() => {
            if (!disabled) handleShowAnswer();
          }}
        />
      ) : (
        <div
          className="player-icon add-time-icon"
          onClick={() => {
            if (!disabled) handleAdd();
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
      <div
        className="d-flex justify-content-center align-items-center"
        style={{
          height: "32px",
          width: "55px",
          margin: "auto",
        }}
      >
        <div
          className="player-icon next-icon"
          onClick={() => {
            if (!disabled) {
              player.pause();
              handleNext();
            }
          }}
        />
      </div>
    </div>
  );
}
