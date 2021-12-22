const fs = require("fs");
let input = fs.readFileSync("./input.txt", { encoding: "utf-8" });
let lines = input.split("\n");
let instructions = lines.map((line) => line.split(" "));

for (let inst of instructions) {
  inst[1] = inst[1].split(",").map((coord) =>
    coord
      .split("=")[1]
      .split("..")
      .map((num) => parseInt(num))
  );
}

function part1() {
  let intervals = {
    x: [],
    y: [],
    z: []
  }



  function sortIntervals(intervalList){
    intervalList.sort((int1, int2) => int1[0] - int2[0]);
  }

  function mergeOverlappingIntervals(intervalList){
    for(let i = 1; i < intervalList.length; i++){
      if(intervalList[i][0] <= intervalList[i-1][1]){
        intervalList[i-1][1] = Math.max(intervalList[i-1][1], intervalList[i][1]);
        intervalList.splice(i, 1);
        i--;
      }
    }
  }

  function insertIntervals(xint, yint, zint){
    intervals.x.push(xint);
    sortIntervals(intervals.x);
    intervals.y.push(yint);
    sortIntervals(intervals.y);
    intervals.z.push(zint);
    sortIntervals(intervals.z);

    mergeOverlappingIntervals(intervals.x);
    mergeOverlappingIntervals(intervals.y);
    mergeOverlappingIntervals(intervals.z);
  }

  function removeInterval(toRemove, from){
    let left = toRemove[0];
    let right = toRemove[1];

    let leftIntervalIndex = null;
    let rightIntervalIndex = null;

    for(let i = 0; i < from.length; i++){
      let interval = from[i];
      if(interval[0] <= left && left <= interval[1]){
        leftIntervalIndex = i;
      }

      if(interval[0] <= right && right <= interval[1]){
        rightIntervalIndex = i;
        if(leftIntervalIndex === null){
          break; // if we find right before left, we won't ever find left
        }
      }
    }

    if(leftIntervalIndex !== null && rightIntervalIndex !== null){
      if(leftIntervalIndex === rightIntervalIndex){
        let indexToSlice = leftIntervalIndex;

        if(left === from[indexToSlice][0] && right === from[indexToSlice][1]){
          from.splice(indexToSlice, 1);
        } else {
          if(right+1 <= from[indexToSlice][1])
            from.splice(indexToSlice + 1, 0, [right+1, from[indexToSlice][1]]);
          from[indexToSlice][1] = left-1;
          if(from[indexToSlice][1] < from[indexToSlice][0]){
            from.splice(indexToSlice, 1)
          }
        }
      } else {
        from[leftIntervalIndex][1] = left-1;
        from[rightIntervalIndex][0] = right+1;

        from.splice(leftIntervalIndex + 1, rightIntervalIndex - leftIntervalIndex - 1);

        //now leftinterval hasn't moved, but now the right interval is directly after left

        if(from[leftIntervalIndex+1][0] > from[leftIntervalIndex+1][1]){
          from.splice(leftIntervalIndex+1, 1);
        }

        if(from[leftIntervalIndex][0] > from[leftIntervalIndex][1]){
          from.splice(leftIntervalIndex, 1);
        }
      }
    } else {

      // if(leftIntervalIndex === null && rightIntervalIndex === null){
      //   if(left <= from[0][0] && right >= from[1][1]){
      //     from.splice(0, from.length);
      //   }
      //   return;
      // }

      if(leftIntervalIndex === null && rightIntervalIndex !== null) {

        let closestLeft = 0;
        while(closestLeft < from.length && from[closestLeft][0] < left) closestLeft++;
        from.splice(closestLeft, rightIntervalIndex - closestLeft);
        from[closestLeft][0] = right + 1;
        if(from[closestLeft][0] > from[closestLeft][1]) {
          from.splice(0, 1);
        }
      }else if(rightIntervalIndex === null && leftIntervalIndex !== null){
        let closestRight = 0;
        while(closestRight < from.length && from[closestRight][0] < right) closestRight++;
        from[leftIntervalIndex][1] = left - 1;
        from.splice(leftIntervalIndex+1, closestRight - leftIntervalIndex);
        if(from[leftIntervalIndex][0] > from[leftIntervalIndex][1]){
          from.splice(leftIntervalIndex, 1);
        }
      }else{

        let closestLeft = 0;
        while(closestLeft < from.length && from[closestLeft][0] < left) closestLeft++;

        let closestRight = 0;
        while(closestRight < from.length && from[closestRight][0] < right) closestRight++;

        from.splice(closestLeft, closestRight - closestLeft);
        
      }
    }
  }

  for (let [mode, ranges] of instructions) {
    if(mode === "on"){
      insertIntervals(...ranges);
    }else if(mode === "off"){
      removeInterval(ranges[0], intervals.x);
      removeInterval(ranges[1], intervals.y);
      removeInterval(ranges[2], intervals.z);
    }
    console.log("line");
  }

  let total = 0;
  let counts = []
  for(let [axis, intList] of Object.entries(intervals)){
    counts.push(intList.map(pair => pair[1] - pair[0] + 1))
  }

  for(let xCount of counts[0])
    for(let yCount of counts[1])
      for(let zCount of counts[2])
        total += xCount * yCount * zCount

  console.log(intervals);
  console.log(counts);
  console.log(total);
  
}


part1();
