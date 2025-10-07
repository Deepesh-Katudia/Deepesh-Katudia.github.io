// ---------- Game state ----------
let board;               
let currentPlayer;         
let gameOver;
let winner;                
let scores;               
let winningLine = null;    
let mode = "bot";          
const botMark = "O";


const LINES = [
  [0,1,2],[3,4,5],[6,7,8],
  [0,3,6],[1,4,7],[2,5,8],
  [0,4,8],[2,4,6],
];


function initializeGame(hardReset = false) {
  if (hardReset || !scores) scores = { X: 0, O: 0, draws: 0 };
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

 
  if (winningLine) {
    winningLine.forEach(i => {
      const el = document.querySelector(`.cell:nth-of-type(${(i%3)+1})`);
    });
    winningLine.forEach(i => {
      const el = document.querySelectorAll(".cell")[i];
      if (el) el.classList.add("win");
    });
  }

  const statusEl = document.getElementById("status");
  const modeLabel = mode === "bot" ? " (Vs Bot)" : " (Two Players)";
  if (gameOver) {
    statusEl.textContent = winner ? `Winner: ${winner}${modeLabel}` : `It's a draw!${modeLabel}`;
  } else {
    statusEl.textContent = `Turn: ${currentPlayer}${modeLabel}`;
  }

  document.getElementById("scoreX").textContent = scores.X;
  document.getElementById("scoreO").textContent = scores.O;
  document.getElementById("scoreDraws").textContent = scores.draws;
}


function checkWinner() {
  for (const [a,b,c] of LINES) {
    if (board[a] && board[a] === board[b] && board[a] === board[c]) {
      gameOver = true;
      winner = board[a];
      winningLine = [a,b,c];
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


function cellClicked(index) {
  if (gameOver || board[index]) return;


  makeMove(index, currentPlayer);
  renderBoard();
  if (gameOver) return;


  if (mode === "bot" && currentPlayer === botMark) {
    setTimeout(() => {
      const i = chooseBotMove();
      if (i !== -1) makeMove(i, botMark);
      renderBoard();
    }, 250);
  }
}

function makeMove(index, player) {
  if (board[index] || gameOver) return;
  board[index] = player;
  checkWinner();
  if (!gameOver) currentPlayer = currentPlayer === "X" ? "O" : "X";
}


function chooseBotMove() {
  const me = botMark;
  const opp = me === "X" ? "O" : "X";


  let mv = findLineMove(me);
  if (mv !== -1) return mv;

 
  mv = findLineMove(opp);
  if (mv !== -1) return mv;


  if (!board[4]) return 4;


  for (const i of [0,2,6,8]) if (!board[i]) return i;

 
  for (const i of [1,3,5,7]) if (!board[i]) return i;

  return -1;
}

function findLineMove(mark) {
  for (const [a,b,c] of LINES) {
    const line = [a,b,c];
    const empties = line.filter(i => !board[i]);
    const count = line.map(i => board[i]).filter(v => v === mark).length;
    if (count === 2 && empties.length === 1) return empties[0];
  }
  return -1;
}


function setMode(newMode) {
  if (newMode !== "bot" && newMode !== "pvp") return;
  mode = newMode;


  document.getElementById("btnPvp").classList.toggle("active", mode === "pvp");
  document.getElementById("btnBot").classList.toggle("active", mode === "bot");

  
  initializeGame();
}


window.addEventListener("DOMContentLoaded", () => {
  initializeGame(true);
});
