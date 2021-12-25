const fs = require("fs");
let input = fs.readFileSync("./input.txt", { encoding: "utf-8" });
let matrix = input.split("\r\n").map(l => l.split(""))

console.log(matrix);

let dimensions = [matrix.length, matrix[0].length];

let positions = {}
for(let i = 0; i < dimensions[0]; i++)
  for(let j = 0; j < dimensions[1]; j++)
    if (matrix[i][j] !== ".") positions[hashPosition(i, j)] = matrix[i][j];


function hashPosition(i, j){
  return i + "," + j;
}

function unhashPosition(str){
  return str.split(",").map(e => parseInt(e));
}

function step(){
  let moves = 0;
  let newPositions = {};
  for(let p in positions){
    let value = positions[p];
    if(value === ">"){
      let pos = unhashPosition(p);
      if(positions[hashPosition(pos[0], (pos[1] + 1) % dimensions[1])] === undefined){
        newPositions[hashPosition(pos[0], (pos[1] + 1) % dimensions[1])] = value;
        moves++;
        // console.log("east", p);
      }else{
        newPositions[p] = value;
      }
    }
  }

  for(let p in positions){
    let value = positions[p];
    if(value === "v"){
      let pos = unhashPosition(p);
      let wantsToMoveTo = hashPosition((pos[0] + 1) % dimensions[0], pos[1]);
      if((newPositions[wantsToMoveTo] === undefined && positions[wantsToMoveTo] === undefined) || (newPositions[wantsToMoveTo] === undefined && positions[wantsToMoveTo] === ">")){
        newPositions[wantsToMoveTo] = value;
        moves++
        // console.log("sout", p);
      }else{
        // console.log("for", pos, wantsToMoveTo, positions[wantsToMoveTo]);
        newPositions[p] = value;
      }
    }
  }

  positions = newPositions;
  console.log(moves);
  return moves;
}

let result = step();
let steps = 1;
while(result !== 0){
  result = step();
  steps++;
}
console.log(steps);