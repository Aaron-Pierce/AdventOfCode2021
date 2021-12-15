const fs = require("fs");
let input = fs.readFileSync("./input.txt").toString();

let [start, productions] = input.split("\n\n");
productions = productions.split("\n").map((e) => e.split(" -> "));

function part1() {
  let polymer = start;

  // This shouldn't be a one-liner. Sorry.
  let productionMap = productions.reduce(
    (map, rule) => (map[rule[0]] = rule[1]) && map,
    {}
  );

  const NUM_STEPS = 10;
  for (let step = 0; step < NUM_STEPS; step++) {
    let newPolymer = [];

    for (let i = 0; i < polymer.length - 1; i++) {
      let leftElement = polymer.charAt(i);
      let rightElement = polymer.charAt(i + 1);

      newPolymer.push(leftElement);
      if (productionMap[leftElement + rightElement]) {
        newPolymer.push(productionMap[leftElement + rightElement]);
      }
    }

    // we only add the left element of each pair
    // (instead of adding left and right, because pair
    // 0's right is pair 1's left, and it would duplicate elements.)
    // but we can't start a pair at the last element, so we specifically add it.
    newPolymer.push(polymer.charAt(polymer.length - 1));
    polymer = newPolymer.join("");
  }

  let elementCounts = {};
  for (let i = 0; i < polymer.length; i++) {
    let char = polymer.charAt(i);
    if (elementCounts[char] === undefined) elementCounts[char] = 0;
    elementCounts[char]++;
  }
  
  let [minElement, minCount] = [null, Infinity];
  let [maxElement, maxCount] = [null, -Infinity];
  for(let element in elementCounts){
    if(elementCounts[element] < minCount){
      minCount = elementCounts[element];
    }
    if(elementCounts[element] > maxCount){
      maxCount = elementCounts[element];
    }
  }

  console.log("Part 1:", maxCount - minCount);
}
part1();


function part2(){
  let adjacencyMatrix = {}
  let elementSet = new Set();
  for(let char of start.split("")){
    elementSet.add(char)
  }

  for(let rule of productions){
    elementSet.add(...rule[0].split(""));
    elementSet.add(rule[1])
  }

  for(let char of Array.from(elementSet)){
    adjacencyMatrix[char] = {};
    for(let otherChar of Array.from(elementSet)){
      adjacencyMatrix[char][otherChar] = 0;
    }
  }

  for(let i = 0; i < start.length - 1; i++){
    let leftElement = start.charAt(i);
    let rightElement = start.charAt(i + 1);

    adjacencyMatrix[leftElement][rightElement]++;
  }


  const NUM_STEPS = 40;

  for(let step = 0; step < NUM_STEPS; step++){
    let matrixCopy = {};
    for(let element in adjacencyMatrix){
      matrixCopy[element] = Object.assign({}, adjacencyMatrix[element]);
    }

    let matrixPatches = [];

    for(let rule of productions){
      let leftChar = rule[0][0];
      let rightChar = rule[0][1];

      let numberOfMatchingPairs = adjacencyMatrix[leftChar][rightChar];
      matrixCopy[leftChar][rule[1]] += numberOfMatchingPairs;
      matrixCopy[rule[1]][rightChar] += numberOfMatchingPairs;
      matrixCopy[leftChar][rightChar] -= numberOfMatchingPairs;
    }
    adjacencyMatrix = matrixCopy;
  }


  let maxCount = -Infinity;
  let minCount = Infinity;
  for(let element in adjacencyMatrix){
    let count = 0;
    for(let otherElement in adjacencyMatrix[element]){
      count += adjacencyMatrix[element][otherElement];
    }
    if(start.charAt(start.length - 1) === element) count++;
    maxCount = Math.max(maxCount, count);
    minCount = Math.min(minCount, count);
  }

  console.log("Part 2:", maxCount - minCount);


}

part2();