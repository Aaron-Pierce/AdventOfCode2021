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
  // A matrix of characters where adjacencyMatrix[a][b] is the number of times
  // ab appears in the polymer.
  let adjacencyMatrix = {}

  // a set of all elements so that we know how to make
  // the adjacency matrix
  let elementSet = new Set([...start.split("")]);
  for(let rule of productions){
    elementSet.add(...rule[0].split(""));
    elementSet.add(rule[1])
  }

  // init the matrix, all pairs [x][y] set to 0
  for(let char of Array.from(elementSet)){
    adjacencyMatrix[char] = {};
    for(let otherChar of Array.from(elementSet)){
      adjacencyMatrix[char][otherChar] = 0;
    }
  }

  // now increment pairs from the start polymer
  for(let i = 0; i < start.length - 1; i++){
    let leftElement = start.charAt(i);
    let rightElement = start.charAt(i + 1);

    adjacencyMatrix[leftElement][rightElement]++;
  }


  // okay time to do some real work, now

  const NUM_STEPS = 40;
  for(let step = 0; step < NUM_STEPS; step++){
    // create a copy of the matrix, because each step
    // happens in parallel
    let matrixCopy = {};
    for(let element in adjacencyMatrix){
      matrixCopy[element] = Object.assign({}, adjacencyMatrix[element]);
    }

    // apply each production rule everywhere we can
    for(let rule of productions){
      let leftChar = rule[0][0];
      let rightChar = rule[0][1];

      // applying a rule ab -> c results in acb, so we need to represent that in the matrix
      // by removing the ab pair, and inserting ac and cb pairs.
      let numberOfMatchingPairs = adjacencyMatrix[leftChar][rightChar]; // how many times we apply the production
      matrixCopy[leftChar][rightChar] -= numberOfMatchingPairs; // we will break up that many pairs
      matrixCopy[leftChar][rule[1]] += numberOfMatchingPairs; // by inserting some element to the right of the first char
      matrixCopy[rule[1]][rightChar] += numberOfMatchingPairs; // and therefore to the left of the second char
    }

    adjacencyMatrix = matrixCopy; // overwrite the matrix to complete the step
  }


  // find the most common and least common elements
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


console.time("Part 2 Runtime");
part2();
console.timeEnd("Part 2 Runtime");
