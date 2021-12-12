const fs = require("fs");
let input = fs.readFileSync("./input.txt").toString();

input = input.split("\n").map((e) => e.split("").map((f) => parseInt(f)));

function getNeighbors(i, j) {
  let changes = [-1, 0, 1];
  let neighbors = [];
  for (let c1 of changes) {
    for (let c2 of changes) {
      if (!(c1 === 0 && c2 === 0)) {
        let position = [i + c1, j + c2];
        if (
          position[0] >= 0 &&
          position[0] < input.length &&
          position[1] >= 0 &&
          position[1] < input[0].length
        ) {
          neighbors.push([i + c1, j + c2]);
        }
      }
    }
  }
  return neighbors;
}

function getKey(i, j) {
  return `${i},${j}`;
}

function bothParts() {
  let flashes = 0;

  let t = 0;
  for (let t = 0; true; t++) {
    let queue = [];
    let visited = new Set();

    for (let i = 0; i < input.length; i++) {
      for (let j = 0; j < input[i].length; j++) {
        input[i][j]++;
        if (input[i][j] > 9) {
          queue.push([i, j]);
          visited.add(getKey(i, j));
        }
      }
    }


    let locationsFlashed = new Set();

    while (queue.length > 0) {
      let popped = queue.shift();
      visited.add(getKey(...popped));
      flashes++;
      locationsFlashed.add(popped);

      for (let n of getNeighbors(...popped)) {
        input[n[0]][n[1]]++;
        if (input[n[0]][n[1]] > 9) {
          if (!visited.has(getKey(...n))) {
            queue.push(n);
            visited.add(getKey(...n))
          }
        }
      }

      for(let pos of locationsFlashed){
        input[pos[0]][pos[1]] = 0;
      }
    }



    if(t === 99){
      console.log("Part 1", flashes);
    }

    if(locationsFlashed.size === input.length * input[0].length){
      console.log("Part 2, all flash after step:", t+1);
      return;
    }
  }

}

bothParts();
