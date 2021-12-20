const fs = require("fs");
let input = fs.readFileSync("./input.txt", { encoding: "utf-8" })

let [algorithm, inputImage] = input.split("\r\n\r\n"); // windows line endings, always gives me trouble

inputImage = inputImage.split("\r\n").map(e => e.split(""));

let infiniteImage = {};
let imageBounds = {
  minI: 0,
  maxI: 0,
  minJ: 0,
  maxJ: 0
}

// the infinite expanse around your image will alternate
// between completely # and completely . depending on
// how many times you've convolved
let num_convolutions = 0;

function hashPoint(i, j=undefined){
  let x = i;
  let y = j;
  // can pass array or each component as an argument
  // not the nicest way to do this, but it works
  if(Array.isArray(i) && j === undefined){
    x = i[0];
    y = i[1];
  }
  return `${x},${y}`;
}

function unhashPoint(str){
  return str.split(",").map(coord => parseInt(coord));
}

function isWithinImageBounds(i, j){
  if(i < imageBounds.minI) return false;
  if(i > imageBounds.maxI) return false;
  if(j < imageBounds.minJ) return false;
  if(j > imageBounds.maxJ) return false;
  return true;
}

function getPixel(i, j){
  // we only store # in our infiniteImage object,
  // so the absence of a # is a .
  // However, if you're outside the
  // bounds of the image, in the infinite
  // expanse, we can't store infinitely many #
  // so we perform this check, using the fact
  // that the infinite expanse alternates on every convolution
  // between # and .
  if(!isWithinImageBounds(i, j) && algorithm.charAt(0) === "#"){
    // an odd number of convolutions sets the infinite expanse
    // to be the first character of the algorithm,
    // an even number makes it the opposite of the first char
    // (which is hopefully the opposite of the last char, else
    // it will be infinite # forever)
    if(num_convolutions % 2 === 0){
      return algorithm.charAt(algorithm.length - 1) === "#"; // converts # to true and . to false
    }else{
      return algorithm.charAt(0) === "#"; // on odd convolutions, return the opposite of the last char in the algorithm
    }
  };

  return infiniteImage[hashPoint(i, j)] ? true : false;
}

function getNeighborsBinaryString(i, j){
  let changes = [-1, 0, 1];

  let neighbors = [];
  let binaryString = "";
  for(let ci of changes){
    for(let cj of changes){
        let value = getPixel(i + ci, j + cj);
        neighbors.push(value)
        binaryString += value ? "1" : "0";
    }
  }
  return binaryString;
}


function calculateImageBounds(){
  for(let key in infiniteImage){
    let point = unhashPoint(key);
    imageBounds.minI = Math.min(imageBounds.minI, point[0]);
    imageBounds.maxI = Math.max(imageBounds.maxI, point[0]);

    imageBounds.minJ = Math.min(imageBounds.minJ, point[1]);
    imageBounds.maxJ = Math.max(imageBounds.maxJ, point[1]);
  }

  // imageBounds.minI -= 1;
  // imageBounds.minJ -= 1;
  // imageBounds.maxI += 1;
  // imageBounds.maxJ += 1;
}


const EXTRA_BORDER = 3;

function convolve(){
  let newImage = {};
  
  
  for(let i = imageBounds.minI - 1; i <= imageBounds.maxI + 1; i++){
    for(let j = imageBounds.minJ - 1; j <= imageBounds.maxJ + 1; j++){
      let neighborBinaryString = getNeighborsBinaryString(i, j);
      let index = parseInt(neighborBinaryString, 2);
      let algorithmValue = algorithm.charAt(index);
      if(algorithmValue === '#'){
        newImage[hashPoint(i, j)] = true;
      }
    } 
  }
  
  infiniteImage = newImage;
  calculateImageBounds();
  num_convolutions++;
  
}

function print(){
  for(let i = imageBounds.minI - EXTRA_BORDER; i <= imageBounds.maxI + EXTRA_BORDER; i++){
    for(let j = imageBounds.minJ - EXTRA_BORDER; j <= imageBounds.maxJ + EXTRA_BORDER; j++){
      let value = getPixel(i, j);
      if(i === 0 && j === 0) process.stdout.write("*")
      else process.stdout.write(value ? "#" : ".")
    }
    process.stdout.write("\n")
  }
}


function countLitPixels(){
  let numLitPixels = 0;

  for(let i = imageBounds.minI - 0; i <= imageBounds.maxI + 0; i++){
    for(let j = imageBounds.minJ - 0; j <= imageBounds.maxJ + 0; j++){
      let value = getPixel(i, j);
      if(value) numLitPixels++;
    }
  }
  return numLitPixels;
}


for(let i = 0; i < inputImage.length; i++){
  for(let j = 0; j < inputImage[i].length; j++){
    // the absence of a value is false
    if(inputImage[i][j] === "#"){
      infiniteImage[hashPoint([i, j])] = true;
    }
  }
}

calculateImageBounds();



print();

console.log("\n");


const NUM_CONVOLUTIONS = 50;
for(let i = 0; i < NUM_CONVOLUTIONS; i++){
  convolve();
  if(i === 1){
    console.log("Part 1: ", countLitPixels());
  }
}

console.log("\n");

print();


console.log("Part 2:", countLitPixels());