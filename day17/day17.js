const fs = require("fs");
let input = fs.readFileSync("./input.txt", { encoding: "utf-8" });


/*

  A sloppy bruteforce. I sunk two hours trying to reason through a nice,
  optimal solution to part 1, but couldn't make much headway.
  What remains is a bruteforce solution to just make it through the puzzle today.
  Not very pretty, but it works.

*/



let target = input
  .replace("target area: ", "")
  .split(", ")
  .map((e) =>
    e
      .substring(2)
      .split("..")
      .map((f) => parseInt(f))
  );

let maxHeight = 0;
let iters = 0;
let numFound = 0;
function find(){
  for (let i = 0; i < 200; i++) {
    for (let j = -200; j < 200; j++) {  
      let pos = [0, 0];
      let vel = [i, j];  
      let maxReached = -Infinity;
      for (let t = 0; t < 1000; t++) {
        pos[0] += vel[0];
        pos[1] += vel[1];
        maxReached = Math.max(maxReached, pos[1]);
  
        if (
          pos[0] >= target[0][0] &&
          pos[0] <= target[0][1] &&
          pos[1] >= target[1][0] &&
          pos[1] <= target[1][1]
        ) {
          // console.log("found one within bounds at t = " + t);
          if(maxReached > maxHeight){
            console.log("new max", maxReached, [i, j]);
          }
          maxHeight = Math.max(maxReached, maxHeight);
          numFound++;
          break;
        
        } else {
          // console.log(pos, target);
        }
        vel[0] -= Math.sign(vel[0]);
        vel[1] -= 1;
      }
  
    }
  }

}
find();
console.log(maxHeight, numFound);
