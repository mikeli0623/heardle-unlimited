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

export default function Results({
  gameState,
  times,
  songIndex,
  userAnswers,
  searchResults,
}) {
  const winQuotes = ["You won!"];
  const loseQuotes = ["You lost.", "Better luck next time.", "So close."];

  return (
    <div
      className="d-flex flex-column justify-content-center align-items-center flex-grow-1"
      style={{ textAlign: "center" }}
    >
      <div
        id="album-cover"
        style={{
          backgroundImage: `url(${searchResults[songIndex].albumUrlMed})`,
        }}
      />
      <h4>
        {gameState === "Won"
          ? winQuotes[Math.floor(Math.random() * winQuotes.length)]
          : loseQuotes[Math.floor(Math.random() * loseQuotes.length)]}
      </h4>
      Title: {searchResults[songIndex].title}
      <br />
      Artist: {searchResults[songIndex].artists[0].name}
      <br />
      Album: {searchResults[songIndex].album}
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
                  : userAnswers[index] === searchResults[songIndex].pattern
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
