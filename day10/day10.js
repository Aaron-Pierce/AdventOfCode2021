const fs = require("fs");
let input = fs.readFileSync("./input.txt").toString();

input = input.split("\n").map((e) => e.split(""));

function part1() {
  let scores = {
    ")": 3,
    "]": 57,
    "}": 1197,
    ">": 25137,
  };

  let score = 0;
  for (let line of input) {
    let stack = [];
    for (let bracket of line) {
      let opening = ["{", "[", "<", "("];
      let closing = ["}", "]", ">", ")"];
      if (opening.indexOf(bracket) !== -1) {
        stack.push(bracket);
      } else if (closing.indexOf(bracket) !== -1) {
        let topOfStack = stack[stack.length - 1];
        if (topOfStack === opening[closing.indexOf(bracket)]) {
          stack.pop();
        } else {
          score += scores[bracket];
          break;
        }
      }
    }
  }

  console.log(score);
}

part1();

function part2() {
  let scores = [];

  let opening = ["{", "[", "<", "("];
  let closing = ["}", "]", ">", ")"];
  for (let line of input) {
    let stack = [];
    let invalid = false;
    for (let bracket of line) {
      if (opening.indexOf(bracket) !== -1) {
        // if it's an opening bracket
        stack.push(bracket);
      } else if (closing.indexOf(bracket) !== -1) {
        // if it's closing
        let topOfStack = stack[stack.length - 1];
        if (topOfStack === opening[closing.indexOf(bracket)]) {
          stack.pop();
        } else {
          invalid = true;
          break;
        }
      }
    }

    if (!invalid) {
      let score = 0;
      while (stack.length > 0) {
        let popped = stack.pop();
        let matchingClosing = closing[opening.indexOf(popped)];
        let bracketScoreValues = {
          ")": 1,
          "]": 2,
          "}": 3,
          ">": 4,
        };

        score *= 5;
        score += bracketScoreValues[matchingClosing];
      }
      scores.push(score);
    }
  }

  let sorted = scores.sort((a, b) => a - b);
  console.log(sorted[Math.floor(sorted.length / 2)]);
}

part2();
