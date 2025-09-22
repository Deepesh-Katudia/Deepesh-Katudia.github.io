// Hello World (kept)
console.log("Hello World");

// -------- Game state --------
let board;                   // ["", "X", "O", ...]
let currentPlayer;           // "X" or "O"
let gameOver;
let winner;                  // "X" | "O" | null
let scores;                  // { X: number, O: number, draws: number }
let winningLine = null;      // [a,b,c] when someone wins

// Bot config
const botEnabled = true;
const botMark = "O";         // bot plays as O

// Lines to check for winner
const LINES = [
  [0,1,2], [3,4,5], [6,7,8],
  [0,3,6], [1,4,7], [2,5,8],
  [0,4,8], [2,4,6],
];

// -------- Board generation (auto) --------
function buildBoard() {
  const root = document.getElementById("gameBoard");
  root.innerHTML = ""; // clear if rebuilding

  for (let r = 0; r < 3; r++) {
    const row = document.createElement("div");
    row.className = "row";
    for (let c = 0; c < 3; c++) {
      const index = r * 3 + c;
      const cell = document.createElement("div");
      cell.className = "cell";
      cell.dataset.index = index;
      cell.onclick = () => cellClicked(index);
      row.appendChild(cell);
    }
    root.appendChild(row);
  }
}

// -------- Init / Render --------
function initializeGame(hardReset = false) {
  if (hardReset || !scores) scores = { X: 0, O: 0, draws: 0 };
  if (!document.querySelector(".row")) buildBoard(); // build once
  board = Array(9).fill("");
  currentPlayer = "X";
  gameOver = false;
  winner = null;
  winningLine = null;
  renderBoard();
}

function renderBoard() {
  const cells = document.getElementsByClassName("cell");
  for (let i = 0; i < cells.length; i++) {
    cells[i].innerText = board[i];
    cells[i].classList.remove("win");
  }

  // Add win highlight if any
  if (winningLine) {
    winningLine.forEach(i => {
      const el = document.querySelector(`.cell[data-index="${i}"]`);
      if (el) el.classList.add("win");
    });
  }

  const statusEl = document.getElementById("status");
  if (gameOver) {
    statusEl.textContent = winner ? `Winner: ${winner}` : "It's a draw!";
  } else {
    statusEl.textContent = `Turn: ${currentPlayer}`;
  }

  // scores
  document.getElementById("scoreX").textContent = scores.X;
  document.getElementById("scoreO").textContent = scores.O;
  document.getElementById("scoreDraws").textContent = scores.draws;
}

// -------- Winner check --------
function checkWinner() {
  for (const [a, b, c] of LINES) {
    if (board[a] && board[a] === board[b] && board[a] === board[c]) {
      gameOver = true;
      winner = board[a];
      winningLine = [a, b, c];
      scores[winner] += 1;
      return winner;
    }
  }
  if (board.every(v => v)) {
    gameOver = true;
    winner = null;
    winningLine = null;
    scores.draws += 1;
    return null;
  }
  return undefined;
}

// -------- Player actions --------
function cellClicked(index) {
  if (gameOver || board[index]) return;

  // Human move
  makeMove(index, currentPlayer);
  if (gameOver) { renderBoard(); return; }

  // Bot move (slight delay for UX)
  if (botEnabled && currentPlayer === botMark) {
    renderBoard();
    setTimeout(() => {
      const botIndex = chooseBotMove();
      if (botIndex !== -1) makeMove(botIndex, botMark);
      renderBoard();
    }, 250);
  } else {
    renderBoard();
  }
}

function makeMove(index, player) {
  if (board[index] || gameOver) return;
  board[index] = player;
  checkWinner();
  if (!gameOver) {
    currentPlayer = currentPlayer === "X" ? "O" : "X";
  }
}

// -------- Simple bot (win > block > center > corner > side) --------
function chooseBotMove() {
  // Try to win
  let move = findLineMove(botMark);
  if (move !== -1) return move;
  // Try to block
  const human = botMark === "X" ? "O" : "X";
  move = findLineMove(human);
  if (move !== -1) return move;
  // Center
  if (!board[4]) return 4;
  // Corners
  for (const i of [0,2,6,8]) if (!board[i]) return i;
  // Sides
  for (const i of [1,3,5,7]) if (!board[i]) return i;
  return -1;
}

function findLineMove(mark) {
  for (const [a, b, c] of LINES) {
    const line = [a, b, c];
    const marks = line.map(i => board[i]);
    const empties = line.filter(i => !board[i]);
    const count = marks.filter(v => v === mark).length;
    if (count === 2 && empties.length === 1) return empties[0];
  }
  return -1;
}

// -------- Boot --------
window.addEventListener("DOMContentLoaded", () => {
  initializeGame(true);
});
