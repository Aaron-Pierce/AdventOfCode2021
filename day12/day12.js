const fs = require("fs");
let input = fs.readFileSync("./input.txt").toString();

input = input.split("\n").map(e => e.split("-"));

let adjacencyList = {};

for(let [cave1, cave2] of input){
  if(adjacencyList[cave1] === undefined) adjacencyList[cave1] = [];
  if(adjacencyList[cave2] === undefined) adjacencyList[cave2] = [];
  adjacencyList[cave1].push(cave2);
  adjacencyList[cave2].push(cave1)
}


function part1(){
  function recurse(currCave, visitedSet, pathString){
    if(currCave === "end") return 1;

    let numberOfPaths = 0;
    
    if(currCave.toLowerCase() === currCave){
      visitedSet.add(currCave);
    }

    for(let n of adjacencyList[currCave]){
      if(!visitedSet.has(n)){
        numberOfPaths += recurse(n, new Set(Array.from(visitedSet)), pathString + n+",")
      }
    }

    return numberOfPaths;
  }

  let solution = recurse("start", new Set(), "start,")
  console.log(solution);
}
part1();

// maintain a list of visited nodes, as well as a bonus that can be spent
// if the bonus hasn't been spent, it's null.
// if you ever want to visit a small cave that is already visited,
// you can 'spend' the bonus, setting it to the cave to denote that you spent it
// and it allows you to visit that cave once more.
function part2(){
  function recurse(currCave, visitedSet, bonus, pathString){
    if(currCave === "end"){
      console.log(pathString);
      return 1;
    };

    let numberOfPaths = 0;
    
    if(currCave.toLowerCase() === currCave){
      visitedSet.add(currCave);
    }

    for(let n of adjacencyList[currCave]){
      if(!visitedSet.has(n) || (visitedSet.has(n) && bonus === null)){
        let newBonus = bonus;
        if(visitedSet.has(n) && bonus === null){
          if(n === "start" || n === "end") continue;
          newBonus = n;
        }
        numberOfPaths += recurse(n, new Set(Array.from(visitedSet)), newBonus, pathString + n+",")
      }
    }


    return numberOfPaths;
  }

  let solution = recurse("start", new Set(), null, "start,")
  console.log(solution);
}

part2();