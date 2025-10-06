import { useMemo, useState } from "react";
import "./App.css";

const LINES = [
  [0,1,2],[3,4,5],[6,7,8],
  [0,3,6],[1,4,7],[2,5,8],
  [0,4,8],[2,4,6],
];

function calculateWinner(squares) {
  for (const [a,b,c] of LINES) {
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return { player: squares[a], line: [a,b,c] };
    }
  }
  return squares.every(Boolean) ? { player: null, line: null } : null;
}

function Square({ value, onClick, highlight }) {
  return (
    <button className={`square ${highlight ? "win" : ""}`} onClick={onClick}>
      {value}
    </button>
  );
}

function Board({ squares, onPlay, winningLine }) {
  function handleClick(i) {
    if (squares[i] || winningLine) return;
    onPlay(i);
  }

  return (
    <div className="board">
      {squares.map((val, i) => (
        <Square
          key={i}
          value={val}
          onClick={() => handleClick(i)}
          highlight={winningLine?.includes(i)}
        />
      ))}
    </div>
  );
}

function StatusBar({ status }) {
  return <div className="status">{status}</div>;
}

function MoveList({ historyLength, currentMove, onJump }) {
  return (
    <ol className="moves">
      {Array.from({ length: historyLength }, (_, move) => {
        const desc = move === 0 ? "Go to game start" : `Go to move #${move}`;
        return (
          <li key={move}>
            <button
              className={`move-btn ${move === currentMove ? "active" : ""}`}
              onClick={() => onJump(move)}
            >
              {desc}
            </button>
          </li>
        );
      })}
    </ol>
  );
}

export default function App() {
  // history[move] is a board (array of 9): "", "X", "O"
  const [history, setHistory] = useState([Array(9).fill("")]);
  const [currentMove, setCurrentMove] = useState(0);

  const xIsNext = currentMove % 2 === 0;
  const currentSquares = history[currentMove];

  const result = useMemo(
    () => calculateWinner(currentSquares),
    [currentSquares]
  );
  const winner = result?.player ?? undefined;
  const winningLine = result?.line ?? undefined;

  function handlePlay(i) {
    const nextSquares = currentSquares.slice();
    nextSquares[i] = xIsNext ? "X" : "O";

    const nextHistory = history.slice(0, currentMove + 1).concat([nextSquares]);
    setHistory(nextHistory);
    setCurrentMove(nextHistory.length - 1);
  }

  function jumpTo(move) {
    setCurrentMove(move);
  }

  function resetGame() {
    setHistory([Array(9).fill("")]);
    setCurrentMove(0);
  }

  const status =
    winner === undefined
      ? `Next player: ${xIsNext ? "X" : "O"}`
      : winner === null
      ? "It's a draw!"
      : `Winner: ${winner}`;

  return (
    <div className="page">
      <div className="hud">
        <h1 className="title">React Tic-Tac-Toe</h1>
        <StatusBar status={status} />
        <div className="actions">
          <button onClick={resetGame}>Reset</button>
        </div>
      </div>

      <div className="game">
        <Board
          squares={currentSquares}
          onPlay={handlePlay}
          winningLine={winningLine}
        />
        <MoveList
          historyLength={history.length}
          currentMove={currentMove}
          onJump={jumpTo}
        />
      </div>
    </div>
  );
}
