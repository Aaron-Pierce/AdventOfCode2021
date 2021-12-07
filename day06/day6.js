const fs = require("fs");
let input = fs.readFileSync("./input.txt").toString();

input = input.split(",").map(e => parseInt(e));

function part1(num_days){
  let numberOfFishWithAge = new Array(9).fill(0);
  for(let initialFishAge of input){
    numberOfFishWithAge[initialFishAge]++;
  }

  const NUM_DAYS = num_days || 80;
  for(let i = 0; i < NUM_DAYS; i++){
    let howManyWillReproduce = numberOfFishWithAge[0];
    for(let ageIndex = 0; ageIndex < numberOfFishWithAge.length; ageIndex++){
      numberOfFishWithAge[ageIndex] = numberOfFishWithAge[ageIndex+1] || 0;
    }
    numberOfFishWithAge[6] += howManyWillReproduce;
    numberOfFishWithAge[8] += howManyWillReproduce;
  }
  

  console.log(numberOfFishWithAge.reduce((acc, el) => acc+el));
}

part1();

function part2(){
  part1(256);
}

part2();