const fs = require("fs");
let input = fs.readFileSync("./input.txt").toString();


let [dots, folds] = input.split("\r\n\r\n"); // you can tell which ones I did on my windows laptop
dots = dots.split("\r\n").map(e => e.split(",").map(f => parseInt(f)));
folds = folds.split("\r\n").map(e => e.replace("fold along ", "").split("=").map((val, ind) => ind === 1 ? parseInt(val) : val));


function hashPoint(point){
  return point + "";
}

function unhashPoint(pointString){
  return pointString.split(",").map(e => parseInt(e));
}

function bothParts(){
  let pointSet = new Set();
  for(let point of dots){
    pointSet.add(hashPoint(point))
  }


  let isFirstFold = true;
  for(let fold of folds){
    let foldAxis = fold[0] === 'x' ? 0 : 1;
    for(let pointString of Array.from(pointSet)){
      let point = unhashPoint(pointString);
      if(point[foldAxis] > fold[1]){
        let otherAxis = 1 - foldAxis;
        let distanceFromFold = point[foldAxis] - fold[1];
        let newLocation = fold[1] - distanceFromFold;
        let newPoint = [];
        newPoint[foldAxis] = newLocation;
        newPoint[otherAxis] = point[otherAxis];
        pointSet.add(hashPoint(newPoint));
        pointSet.delete(hashPoint(point))
      }
    }

    if(isFirstFold){
      console.log("Part 1: ", pointSet.size);
      isFirstFold = false;
    }
  }


  const cols = 40;
  const rows = 6;

  let toPrint = [];
  for(let i = 0; i < rows; i++){
    toPrint.push(new Array(cols).fill(" "))
  };

  for(let pointString of Array.from(pointSet)){
    let point = unhashPoint(pointString);
    toPrint[point[1]][point[0]] = "#";
  }

  for(let row of toPrint){
    console.log(row.join(""))
  }
}

bothParts();
