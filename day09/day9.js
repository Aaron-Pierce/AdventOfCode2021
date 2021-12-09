const fs = require("fs");
let input = fs.readFileSync("./input.txt").toString();

input = input.split("\r\n").map(e => e.split("").map(f => parseInt(f)));

function part1() {
  let totalRisk = 0;
  for (let i = 0; i < input.length; i++) {
    for (let j = 0; j < input[i].length; j++) {
      let neighbors = [
        (input[i + 1] || [])[j],
        (input[i - 1] || [])[j],
        (input[i] || [])[j + 1],
        (input[i] || [])[j - 1],
      ]

      let height = input[i][j];
      let isLowPoint = true;
      for (let n of neighbors) {
        if (n !== undefined && n <= height) {
          isLowPoint = false;
          break;
        }
      }

      if (isLowPoint) {
        totalRisk += height + 1;
      }
    }
  }
  console.log(totalRisk);
}

part1();

function part2() {
  let visited = new Set();
  let basins = []
  for (let i = 0; i < input.length; i++) {
    for (let j = 0; j < input[i].length; j++) {
      let key = `${i},${j}`;
      if(!visited.has(key) && input[i][j] !== 9){
        // console.log("New beginning at ",i,j, input[i][j]);
        let basinSize = 0;

        let queue = [[i, j]];

        while(queue.length > 0){
          let popped = queue.shift();

          visited.add(`${popped[0]},${popped[1]}`);
          // console.log("Visiting ", popped, "with value", input[popped[0]][popped[1]]);
          basinSize++;
          
          let neighborIndicies = [
            [popped[0]+1, popped[1]],
            [popped[0]-1, popped[1]],
            [popped[0], popped[1]+1],
            [popped[0], popped[1]-1],
          ]

          for(let indicies of neighborIndicies){
            if(!visited.has(`${indicies[0]},${indicies[1]}`) && input[indicies[0]] !== undefined && input[indicies[0]][indicies[1]] !== undefined){
              let height = input[indicies[0]][indicies[1]];
              if(height !== 9){
                queue.push([...indicies])
                visited.add(`${indicies[0]},${indicies[1]}`)
              }
            }
          }

        }

        console.log("Found basin of size", basinSize);
        basins.push(basinSize);

      }
    }
  }

  let sorted = basins.sort((a, b) => b - a);
  console.log(sorted[0] * sorted[1] * sorted[2]);
}

part2();
