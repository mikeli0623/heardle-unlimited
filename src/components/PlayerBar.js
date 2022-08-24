import { ProgressBar } from "react-bootstrap";
import { strictRound } from "../utils";

export default function PlayerBar({
  time,
  totalTime,
  times,
  timeIndex,
  showAnswer,
  offset,
  setSeekRatio,
  setSeeking,
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

  // need on leave handlers too
  const handleSeek = (e) => {
    if (!showAnswer) return;
    setSeeking(true);
    const barWidth = e.target.firstChild
      ? e.target.offsetWidth
      : e.target.parentNode.offsetWidth;
    const relX = e.clientX - e.target.offsetLeft + 1;
    if (relX <= 0) setSeekRatio(0);
    else if (relX > barWidth) setSeekRatio(1);
    else setSeekRatio(Math.round((relX / barWidth) * 100) / 100);
  };

  return (
    <div id="player-bar">
      <span className="player-time">{calcTime(time)}</span>
      <ProgressBar
        className="no-transition daddy-bar"
        variant="light"
        style={{
          cursor: `${showAnswer ? "pointer" : "default"}`,
        }}
        onClick={(e) => handleSeek(e)}
      >
        <ProgressBar
          variant="custom"
          now={(strictRound(time, 0.5) / totalTime) * 100}
          key="track-time"
        />
        {!showAnswer && (
          <ProgressBar
            variant="light"
            className="no-transition"
            now={
              ((times[timeIndex] + offset) / totalTime) * 100 -
              (strictRound(time, 0.5) / totalTime) * 100
            }
            key="given-time"
          />
        )}
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
