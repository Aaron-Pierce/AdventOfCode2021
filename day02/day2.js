const fs = require("fs");
let input = fs.readFileSync("./input.txt").toString();

input = input.split("\n");

function part1() {
  let [horizontal, depth] = [0, 0];

  for (let line of input) {
    let command = line.split(" ");
    let direction = command[0];
    let distance = parseInt(command[1]);

    if(direction === "forward") horizontal += distance;
    else if(direction === "down") depth += distance;
    else if(direction === "up") depth -= distance;
  }

  console.log(horizontal * depth);
}

part1();

function part2() {
  let [horizontal, depth, aim] = [0, 0, 0];

  for (let line of input) {
    let command = line.split(" ");
    let direction = command[0];
    let distance = parseInt(command[1]);

    if(direction === "down") aim += distance;
    else if(direction === "up") aim -= distance;
    else if(direction === "forward"){
      horizontal += distance;
      depth += distance * aim;
    } 
  }

  console.log(horizontal * depth);
}

part2();
