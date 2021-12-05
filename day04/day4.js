/*
 * A dumb bruteforce solution. For each new number 'called' from the input sequence,
 * check all the boards
 *
*/

const fs = require("fs");
let input = fs.readFileSync("./input.txt", { encoding: "utf-8" }).split("\n\n");
let numberSequence = input
  .shift()
  .split(",")
  .map((e) => parseInt(e));
// this is a gnarly way to get a matrix from the board
let boards = input.map(
  // replace each entire board's string
  (e) =>
    e
      .split("\n") // by an array of entire row strings
      .map(
        (f) =>
          f
            .split(" ") // that should be divided into an array of individual values
            .filter((g) => g !== "") // that may be empty because the input has a leading space before single digit numbers (14) vs ( 4), it will split that extra space into ''
            .map((h) => parseInt(h)) // that should finally be parsed as an int
      )
);


// Returns whether or not a board has a bingo
// after index+1 numbers have been called
// so if index is 7, it will check if the board
// can win by only using numbers [0..7] in the sequence
function verifyBoard(board, index) {
  let numbersCalled = new Set();
  for (let i = 0; i <= index; i++) {
    numbersCalled.add(numberSequence[i]);
  }

  let boardHasBingo = false;

  function checkRow() {
    for (let row of board) {
      let rowHasBingo = true;
      for (let entry of row) {
        if (!numbersCalled.has(entry)) {
          rowHasBingo = false;
          break;
        }
      }

      if (rowHasBingo) {
        return true;
      }
    }

    return false;
  }

  function checkCol() {
    for (let colIndex = 0; colIndex < board.length; colIndex++) {
      let colHasBingo = true;
      for (let row of board) {
        let colEntry = row[colIndex];
        if (!numbersCalled.has(colEntry)) {
          colHasBingo = false;
          break;
        }
      }

      if (colHasBingo) {
        return true;
      }
    }

    return false;
  }

  // oops, diagonals don't count.
  // wrote this anyway
  function checkDiagonals() {
    let mainDiagHasBingo = true;
    let offDiagHasBingo = true;
    for (let diagIndex = 0; diagIndex < board.length; diagIndex++) {
      let mainDiagonalEntry = board[diagIndex][diagIndex];
      let offDiagonalEntry = board[board.length - (1 + diagIndex)][diagIndex];
      if (!numbersCalled.has(mainDiagonalEntry)) {
        mainDiagHasBingo = false;
      }

      if (!numbersCalled.has(offDiagonalEntry)) {
        offDiagHasBingo = false;
      }
    }

    return mainDiagHasBingo || offDiagHasBingo;
  }

  // if checkRow succeeds, checkCol won't be run at all. 
  // thanks to lazy evaluation (I think that's called lazy evaluation).
  // This'll save us a teeny bit of time
  if (checkRow() || checkCol()) {
    let totalBoardSum = board.reduce(
      (acc, row) =>
        acc +
        row.reduce(
          (rowAcc, rowEntry) =>
            rowAcc + (numbersCalled.has(rowEntry) ? 0 : rowEntry),
          0
        ),
      0
    );
    return totalBoardSum * numberSequence[index];
  }
}

function part1() {
  for (let index in numberSequence) {
    for (let board of boards) {
      let score = verifyBoard(board, index);
      if (score > 0) {
        console.log(score);
        return;
      }
    }
  }
}

part1();

function part2() {
  let lastWinningBoard = null;
  let boardsWon = new Set();
  for (let index in numberSequence) {
    for (let boardIndex in boards) {
      if (boardsWon.has(boardIndex)) continue;
      let board = boards[boardIndex];
      let score = verifyBoard(board, index);
      if (score > 0) {
        lastWinningBoard = score;
        boardsWon.add(boardIndex);
      }
    }
  }

  console.log(lastWinningBoard);
}

part2();
