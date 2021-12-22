const fs = require("fs");
let input = fs.readFileSync("./input.txt", { encoding: "utf-8" });
let startPositions = input
  .split("\n")
  .map((line) => parseInt(line.split(": ")[1]));

class DeterministicDie {
  constructor() {
    this.lastRoll = 0;
    this.rollCount = 0;
  }

  roll() {
    let roll = this.lastRoll + 1 > 100 ? 1 : this.lastRoll + 1;
    this.lastRoll = roll;
    this.rollCount += 1;
    return roll;
  }
}

function move(pos, distance) {
  let p = pos + distance;
  if (p > 10) p %= 10;
  if (p === 0) p = 10;
  return p;
}

function part1() {
  let positions = [...startPositions];
  let score = [0, 0];

  let turn = 0;
  let die = new DeterministicDie();
  let turnCount = 0;
  while (score[0] < 1000 && score[1] < 1000) {
    positions[turn] = move(
      positions[turn],
      die.roll() + die.roll() + die.roll()
    );

    score[turn] += positions[turn];
    turn = 1 - turn;
    turnCount++;
  }

  console.log("Part 1: ", score[turn] * die.rollCount);
}

part1();

class DiracDie {
  constructor() {
    this.allPossibleRolls = [];

    for (let i = 1; i <= 3; i++) {
      for (let j = 1; j <= 3; j++) {
        for (let k = 1; k <= 3; k++) {
          this.allPossibleRolls.push([i, j, k]);
        }
      }
    }
  }

  roll() {
    return this.allPossibleRolls;
  }
}

function part2() {
  let memo = {};
  const WINNING_SCORE = 21;
  let die = new DiracDie();

  function universesWonFrom(scores, positions, turn=0) {
    let key = `${scores},${positions},${turn}`;
    if(memo[key] !== undefined) return memo[key];

    if(scores[0] >= WINNING_SCORE){
      memo[key] = [1, 0];
      return memo[key];
    }else if(scores[1] >= WINNING_SCORE){
      memo[key] = [0, 1];
      return memo[key];
    }


    let wins = [0, 0];
    for (let r of die.roll()){
      let sum = r.reduce((acc, el) => acc + el);
      let newPos = move(positions[turn], sum);
      let newScores = [...scores];
      newScores[turn] = scores[turn] + newPos;
      let newPositions = [...positions];
      newPositions[turn] = newPos;
      let result = universesWonFrom(newScores, newPositions, 1 - turn);
      wins[0] += result[0];
      wins[1] += result[1];
    }

    memo[key] = wins;

    return wins;

  }

  console.log(universesWonFrom([0, 0], [...startPositions]))
}
part2();
