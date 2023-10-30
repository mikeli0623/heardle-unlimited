import "../App.css";

const ResultSymbols = ({ result }) => {
  return (
    <div
      className="result-symbols"
      style={{
        backgroundImage: `url(./assets/${result}.png)`,
      }}
    />
  );
};

export default function Results({ times, trackIndex, userAnswers, pool }) {
  const win = userAnswers[userAnswers.length - 1] === pool[trackIndex].pattern;
  const winQuotes = ["You won!", "Nice one!"];
  const loseQuotes = ["You lost.", "Better luck next time.", "So close."];

  return (
    <div
      className="d-flex flex-column justify-content-center align-items-center flex-grow-1"
      style={{ textAlign: "center" }}
    >
      <div
        id="album-cover"
        style={{
          backgroundImage: `url(${pool[trackIndex].albumUrl})`,
        }}
      />
      <h4>
        {win
          ? winQuotes[Math.floor(Math.random() * winQuotes.length)]
          : loseQuotes[Math.floor(Math.random() * loseQuotes.length)]}
      </h4>
      Title: {pool[trackIndex].title}
      <br />
      Artist: {pool[trackIndex].artists[0].name}
      <br />
      Album: {pool[trackIndex].album}
      <br />
      <div className="d-flex">
        {times.map((time, index) => {
          return (
            <ResultSymbols
              key={time + index}
              result={
                index + 1 > userAnswers.length
                  ? "empty"
                  : userAnswers[index] === "skip"
                  ? "skip"
                  : userAnswers[index] === pool[trackIndex].pattern
                  ? "correct"
                  : "wrong"
              }
            />
          );
        })}
      </div>
    </div>
  );
}
