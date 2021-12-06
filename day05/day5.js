const fs = require("fs");
let input = fs.readFileSync("./input.txt", { encoding: "utf-8" });

input = input
  .split("\n")
  .map((e) => e.split(" -> ").map((f) => f.split(",").map((g) => parseInt(g))));

// This is super horrible but it works.
// stores every point on every line and sees
// which points occur multiple times. So horribly ugly.
// O(n*m) space and time, n lines and m points on those lines.
// horrible. M could be huge.

// could do better by pairwise comparing all lines, and storing only intersections,
// but if every line intersects half of all lines (a crosshatch) you still store every point (same space) and now iterate through
// n^2 lines, so maybe this isn't so bad after all
function part1(shouldUseDiagonals=false) {
  let ventLocations = {};
  let numDoubledUp = 0;
  for ([point1, point2] of input) {
    // only horizontal or vertical lines, overridden by shouldUseDiagonals
    if (point1[0] === point2[0] || point1[1] === point2[1] || shouldUseDiagonals) {
      let dx = Math.sign(point2[0] - point1[0]);
      let dy = Math.sign(point2[1] - point1[1]);
      let vector = [dx, dy];
      let location = [...point1];

      while(true){
        let key = location.join(",");
        if(ventLocations[key] === undefined) ventLocations[key] = 0;
        ventLocations[key]++;
        if(ventLocations[key] === 2) numDoubledUp++;

        if(location[0] === point2[0] && location[1] === point2[1]){
          break;
        }
        location[0] += vector[0];
        location[1] += vector[1];
      }
    }

  }

  console.log(numDoubledUp);
}

part1();

function part2() {part1(true)}
part2();
