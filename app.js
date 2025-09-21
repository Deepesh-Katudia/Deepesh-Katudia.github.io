// 1) Hello World
console.log("Hello World");

// 2) Game state (top-level declarations)
let board;          // array of 9 strings: "", "X", or "O"
let currentPlayer;  // "X" or "O"
let gameOver;       // boolean
let winner;         // "X", "O", or null
let scores;         // { X: number, O: number, draws: number }

// 3) Initialize defaults (preserve scores unless hard reset)
function initializeGame(hardReset = false) {
  if (hardReset || !scores) scores = { X: 0, O: 0, draws: 0 };
  board = Array(9).fill("");
  currentPlayer = "X";
  gameOver = false;
  winner = null;
  renderBoard();
}

// 4) Render the board + status + scores
function renderBoard() {
  const cells = document.getElementsByClassName("cell");
  for (let i = 0; i < cells.length; i++) {
    cells[i].innerText = board[i]; // "X", "O", or ""
  }

  const statusEl = document.getElementById("status");
  if (gameOver) {
    statusEl.textContent = winner ? `Winner: ${winner}` : "It's a draw!";
  } else {
    statusEl.textContent = `Turn: ${currentPlayer}`;
  }

  // Update scores (custom mod)
  const xEl = document.getElementById("scoreX");
  const oEl = document.getElementById("scoreO");
  const dEl = document.getElementById("scoreDraws");
  if (xEl) xEl.textContent = scores?.X ?? 0;
  if (oEl) oEl.textContent = scores?.O ?? 0;
  if (dEl) dEl.textContent = scores?.draws ?? 0;
}

// 5) Winner check (rows, cols, diagonals). Also handles draw.
function checkWinner() {
  const lines = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8], // rows
    [0, 3, 6], [1, 4, 7], [2, 5, 8], // cols
    [0, 4, 8], [2, 4, 6],            // diagonals
  ];

  for (const [a, b, c] of lines) {
    if (board[a] && board[a] === board[b] && board[a] === board[c]) {
      gameOver = true;
      winner = board[a]; // "X" or "O"
      scores[winner] += 1;
      return winner;
    }
  }

  // If no empty cells, it's a draw
  if (board.every(cell => cell)) {
    gameOver = true;
    winner = null;
    scores.draws += 1;
    return null;
  }

  return undefined; // game continues
}

// 6) Handle a user clicking a cell
function cellClicked(index) {
  if (gameOver || board[index]) return;     // ignore if over or occupied
  board[index] = currentPlayer;             // place mark
  checkWinner();                            // update gameOver/winner if any
  if (!gameOver) {
    currentPlayer = currentPlayer === "X" ? "O" : "X"; // switch turns
  }
  renderBoard();                            // reflect changes
}

// Auto-init on page load (hard reset to seed scores once)
window.addEventListener("DOMContentLoaded", () => {
  initializeGame(true);
});
