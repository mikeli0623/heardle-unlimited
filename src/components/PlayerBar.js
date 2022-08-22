import { ProgressBar } from "react-bootstrap";
import { strictRound } from "../utils";

export default function PlayerBar({ time, totalTime }) {
  // outputs time format from seconds
  const calcTime = (seconds) => {
    const rounded = Math.round(seconds);
    return `${Math.floor(rounded / 60)}:${rounded % 60 > 9 ? "" : 0}${
      rounded % 60
    }`;
  };
  return (
    <div id="player-bar">
      <span className="player-time">
        {time > totalTime ? calcTime(totalTime) : calcTime(time)}
      </span>
      <ProgressBar
        variant="custom"
        now={(strictRound(time) / totalTime) * 100}
        style={{ width: "800px", height: "10px" }}
      />
      <span className="player-time">{calcTime(totalTime)}</span>
    </div>
  );
}
