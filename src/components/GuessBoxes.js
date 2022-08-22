import React from "react";
import "../App.css";

const GuessBox = ({ guess }) => {
  return (
    <li className={`guess-box ${guess === "skip" ? "skip" : ""}`}>
      <div
        className="guess-box-icon"
        style={{
          backgroundImage: `url(./assets/${
            guess === "skip" ? "skip" : guess === "empty" ? "" : "wrong"
          }.png)`,
        }}
      ></div>
      {guess === "skip" ? "SKIPPED" : guess === "empty" ? "" : guess}
    </li>
  );
};

export default function GuessBoxes({ times, userAnswers }) {
  return (
    <ul id="guess-boxes">
      {times.map((time, index) => {
        return (
          <GuessBox
            guess={
              index + 1 > userAnswers.length ? "empty" : userAnswers[index]
            }
            key={time + index}
          />
        );
      })}
    </ul>
  );
}
