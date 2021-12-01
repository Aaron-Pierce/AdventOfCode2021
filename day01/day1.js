/*
 * Early days are basically a typing speed contest,
 * but here's how I got on the leaderboard:
 * 
 * First, immediately skip to the highlighted
 * white text at the bottom of the page 
 * and don't read anything else.
 * Second, have a ton of boilerplate pre-written.
 * Way more than you need. My file looked like
 * this before I saw the problem:
 * 
 * const fs = require("fs");
 * let input = fs.readFileSync("./input.txt").toString();
 * let lines = input.split("\n");
 * let intLines = input.map(e => parseInt(e));
 * let floatLines = input.map(e => parseFloat(e));
 * let num = parseInt(num);
 * 
 * for(let i = 0; i < lines.length; i++){
 * 
 * }
 * 
 * 
 * This lets you get programming quickly.
 * I looked at the 2020 day 1 and made sure
 * I could solve it as fast as possible.
 * 
 * The next biggest bottleneck is submitting your answer
 * I think some people might automate this, I figure
 * you could programmatically attach your solution to your clipboard
 * and paste it in. I had to open my terminal, run the program,
 * copy it and paste it into the textbox. This would be a good
 * next step to optimize
 *
 * 
*/


const fs = require("fs");
let input = fs.readFileSync("./input.txt").toString();

input = input.split("\n").map(e => parseInt(e));

function part1(){
    let increases = 0;
    for (let i = 1; i < input.length; i++) {
      if (input[i] > input[i-1]) increases++;
    }
    console.log(increases);
}

part1();

function part2(){
    let increases = 0;
    for (let i = 3; i < input.length; i++) {
      let sum = input[i] + input[i - 1] + input[i - 2];
      let prevSum = input[i - 1] + input[i - 2] + input[i - 3];
  
      if (sum > prevSum) increases++;
    }
    console.log(increases);
}

part2();