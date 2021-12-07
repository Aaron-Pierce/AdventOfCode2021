const fs = require("fs");
let input = fs.readFileSync("./input.txt").toString();

input = input.split(",").map(e => parseInt(e));



function findMinimumUsingCostFunction(costFn){

  // find the range of possible targets for the crabs
  let min = Infinity;
  let max = -Infinity;
  for(let position of input){
    min = Math.min(min, position);
    max = Math.max(max, position);
  }

  // for each possible position,
  // compute the fuel burn (returned by the cost function),
  // and keep track of the minimum and return it
  let minValue = Infinity;
  let indexOfMin = -1;
  for(let i = min; i <= max; i++){
    let value = costFn(i);
    if(value < minValue){
      minValue = value;
      indexOfMin = i;
    }
  }

  return minValue;
}

function part1(){

  let bestPosition = findMinimumUsingCostFunction((targetPosition) => {
    // the amount of fuel burned is just the distance to the point
    let fuelBurned = 0;
    for(let position of input){
      let linearDistance = Math.abs(targetPosition - position);
      fuelBurned += linearDistance
    }
    return fuelBurned;
  })

  console.log(bestPosition);
}

part1();

function part2(){
  let bestPosition = findMinimumUsingCostFunction((targetPosition) => {
    let fuelBurned = 0;
    for(let position of input){
      let linearDistance = Math.abs(targetPosition - position);
      let fuelToTravelThatLinearDistance = linearDistance*(linearDistance+1) / 2
      fuelBurned += fuelToTravelThatLinearDistance;
    }
    return fuelBurned;
  })

  console.log(bestPosition);
}

part2();