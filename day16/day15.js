const fs = require("fs");
let input = fs.readFileSync("./input.txt").toString();
let generatedLargeMap = fs.readFileSync("./largemap.txt").toString();

/*
 * This is terrible.
 *
 * I wrote a pretty efficient version that worked backwards, which you can see in part 1
 * and it works for the example test cases, but does not work for part 2, mysteriously.
 * It's kind of like dijkstra's, but in reverse. However it ended up being off by about 6.
 * I think it presupposes you only move left and down
 * (which I know is incorrect) but I don't know why the algorithm assumes that.
 * It's a little late, I should revisit this later because it's still a mystery.
 * Eventually I went to wikipedia and implemented the exact pseudocode for dijkstra's
 * and it works but runs for a very long time. Multiple seconds.
 * This is almost certainly because I hurried through a priority queue
 * because I was getting tired of this problem
 */

function part1(matrix) {
  function isOutsideGrid([i, j]) {
    if (i < 0) return true;
    if (i >= matrix.length) return true;
    if (j < 0) return true;
    if (j >= matrix[i].length) return true;

    return false;
  }

  function getNeighbors([i, j]) {
    return [
      [i + 1, j],
      [i - 1, j],
      [i, j + 1],
      [i, j - 1],
    ].filter((pair) => !isOutsideGrid(pair));
  }

  function hashPoint([i, j]) {
    return `${i},${j}`;
  }

  let alreadyEnqueuedSet = new Set();
  let newMatrix = [];
  for (let i = 0; i < matrix.length; i++) {
    newMatrix.push(new Array(matrix[i].length).fill(Infinity));
  }

  let queue = [];
  let bottomRightPoint = [
    matrix.length - 1,
    matrix[matrix.length - 1].length - 1,
  ];

  newMatrix[bottomRightPoint[0]][bottomRightPoint[1]] =
    matrix[bottomRightPoint[0]][bottomRightPoint[1]];

  queue.push(bottomRightPoint);
  alreadyEnqueuedSet.add(hashPoint(bottomRightPoint));

  while (queue.length > 0) {
    let poppedPoint = queue.shift();
    let poppedRisk = newMatrix[poppedPoint[0]][poppedPoint[1]];

    let neighbors = getNeighbors(poppedPoint);

    for (let n of neighbors) {
      let neighborsMinimumRisk = newMatrix[n[0]][n[1]];
      newMatrix[n[0]][n[1]] = Math.min(
        neighborsMinimumRisk,
        poppedRisk + matrix[n[0]][n[1]]
      );

      if (!alreadyEnqueuedSet.has(hashPoint(n))) {
        queue.push(n);
        alreadyEnqueuedSet.add(hashPoint(n));
      }
    }
  }

  console.log("Part 1:", newMatrix[0][0] - matrix[0][0]);
}

let smallMap = input
  .split("\n")
  .map((line) => line.split("").map((char) => parseInt(char)));
part1(smallMap);

function part2(matrix) {
  function isOutsideGrid([i, j]) {
    if (i < 0) return true;
    if (i >= matrix.length) return true;
    if (j < 0) return true;
    if (j >= matrix[i].length) return true;

    return false;
  }

  function getNeighbors([i, j]) {
    return [
      [i + 1, j],
      [i - 1, j],
      [i, j + 1],
      [i, j - 1],
    ].filter((pair) => !isOutsideGrid(pair));
  }

  function hashPoint([i, j]) {
    return `${i},${j}`;
  }

  let visitedSet = new Set();
  let tentativeDistance = [];
  for (let i = 0; i < matrix.length; i++) {
    tentativeDistance.push(new Array(matrix[i].length).fill(Infinity));
  }

  class BadPriorityQueue {
    constructor() {
      this.arr = [];
    }

    insert(el) {
      this.arr.push(el);
      this.arr = this.arr.sort(
        (a, b) => tentativeDistance[b[0]][b[1]] - tentativeDistance[a[0]][a[1]]
      );
    }

    dequeue() {
      return this.arr.pop();
    }
  }

  let priorityQueue = new BadPriorityQueue();

  tentativeDistance[0][0] = 0;

  let currNode = [0, 0];

  while (
    !visitedSet.has(
      hashPoint([matrix.length - 1, matrix[matrix.length - 1].length - 1])
    )
  ) {
    if (!visitedSet.has(hashPoint(currNode))) {
      for (let n of getNeighbors(currNode)) {
        if (!visitedSet.has(hashPoint(n))) {
          tentativeDistance[n[0]][n[1]] = Math.min(
            tentativeDistance[currNode[0]][currNode[1]] + matrix[n[0]][n[1]],
            tentativeDistance[n[0]][n[1]]
          );

          priorityQueue.insert(n);
        }
      }
      visitedSet.add(hashPoint(currNode));
    }

    currNode = priorityQueue.dequeue();
  }

  console.log("Part 2:",
    tentativeDistance[matrix.length - 1][matrix[matrix.length - 1].length - 1]
  );
}

let largeMap = generatedLargeMap
  .split("\n")
  .map((line) => line.split("").map((char) => parseInt(char)));
part2(largeMap);
