import { useEffect } from "react";
import { ProgressBar } from "react-bootstrap";
import { strictRound } from "../utils";

export default function PlayerBar({
  time,
  totalTime,
  showAnswer,
  times,
  timeIndex,
}) {
  // outputs time format from seconds
  const calcTime = (seconds) => {
    const rounded = Math.round(seconds);
    return `${Math.floor(rounded / 60)}:${rounded % 60 > 9 ? "" : 0}${
      rounded % 60
    }`;
  };

  const diffValues = (arr) => {
    let diff = [];
    arr.forEach((value, index) => {
      if (index + 1 < arr.length) diff.push(arr[index + 1] - value);
    });
    return diff;
  };

  return (
    <div id="player-bar">
      <span className="player-time">
        {time > totalTime ? calcTime(totalTime) : calcTime(time)}
      </span>
      <ProgressBar
        className="no-transition"
        style={{ width: "800px", height: "10px" }}
      >
        <ProgressBar
          variant="custom"
          now={(strictRound(time, 0.5) / totalTime) * 100}
          key="track-time"
        />
        <ProgressBar
          variant="light"
          className="no-transition"
          now={
            (times[timeIndex] / totalTime) * 100 -
            (strictRound(time, 0.5) / totalTime) * 100
          }
          key="given-time"
        />
        {diffValues([...times].splice(timeIndex, times.length)).map(
          (value, index) => {
            return (
              <ProgressBar
                className="no-transition"
                key={value + index}
                variant="blocker"
                now={(value / totalTime) * 100}
              />
            );
          }
        )}
      </ProgressBar>
      <span className="player-time">{calcTime(totalTime)}</span>
    </div>
  );
}
