const fs = require("fs");
let input = fs.readFileSync("./input.txt", { encoding: "utf-8" });
let pairs = input.split("\n").map((str) => JSON.parse(str));

function reduce(snailFishNumber) {
  let hasPerformedAnAction = true;
  let leftmostSplit = {
    parentArr: [],
    indexToSplit: -1,
  };
  function reduce_inner(number, depth, stack) {
    if (!hasPerformedAnAction) {
      if (!isNaN(number)) {
        if (number >= 10) {
          if (leftmostSplit.indexToSplit === -1) {
            let pointer = snailFishNumber;
            for (let i of stack.slice(0, -1)) {
              pointer = pointer[i];
            }

			leftmostSplit.parentArr = pointer;
			leftmostSplit.indexToSplit = stack[stack.length - 1]
          }
        }
      } else if (depth === 4) {
        // explode
        let hasUpdatedLeft = false;
        let hasUpdatedRight = false;
        for (let levelsAbove = 1; levelsAbove <= stack.length; levelsAbove++) {
          let pointer = snailFishNumber;
          for (let i = 0; i < stack.length - levelsAbove; i++) {
            pointer = pointer[stack[i]];
          }
          let indexOfLast = stack[stack.length - levelsAbove];
          if (indexOfLast === 0 && !hasUpdatedRight) {
            let rightSideOfPair = pointer[1];
            if (!isNaN(rightSideOfPair)) {
              pointer[1] += number[1];
              hasUpdatedRight = true;
            } else {
              // is a nested array, find the parent array of the leftmost number
              while (Array.isArray(rightSideOfPair)) {
                if (Array.isArray(rightSideOfPair[0])) {
                  rightSideOfPair = rightSideOfPair[0];
                } else {
                  break;
                }
              }
              rightSideOfPair[0] += number[1];
              hasUpdatedRight = true;
            }
          } else if (indexOfLast === 1 && !hasUpdatedLeft) {
            let leftSideOfPair = pointer[0];
            if (!isNaN(leftSideOfPair)) {
              pointer[0] += number[0];
              hasUpdatedLeft = true;
            } else {
              // is a nested array, find the parent array of the rightmost number
              while (Array.isArray(leftSideOfPair)) {
                if (Array.isArray(leftSideOfPair[1])) {
                  leftSideOfPair = leftSideOfPair[1];
                } else {
                  break;
                }
              }
              leftSideOfPair[1] += number[0];
              hasUpdatedLeft = true;
            }
          }
        }

        let pointer = snailFishNumber;
        for (let i = 0; i < stack.length - 1; i++) {
          pointer = pointer[stack[i]];
        }

        pointer[stack[stack.length - 1]] = 0;
        hasPerformedAnAction = true;
      } else {
        if (Array.isArray(number)) {
          reduce_inner(number[0], depth + 1, [...stack, 0]);
          reduce_inner(number[1], depth + 1, [...stack, 1]);
        }
      }
    }
  }


  while (hasPerformedAnAction) {
    hasPerformedAnAction = false;
    reduce_inner(snailFishNumber, 0, []);
	if(hasPerformedAnAction === false && leftmostSplit.indexToSplit !== -1){
		// perform split
		let value = leftmostSplit.parentArr[leftmostSplit.indexToSplit];
		leftmostSplit.parentArr[leftmostSplit.indexToSplit] = [Math.floor(value / 2), Math.ceil(value / 2)];
		hasPerformedAnAction = true;
		leftmostSplit = {
			parentArr: [],
			indexToSplit: -1
		}
	}
  }

}

let sum = JSON.parse(JSON.stringify(pairs[0]));
for (let i = 1; i < pairs.length; i++) {
  sum = [sum, JSON.parse(JSON.stringify(pairs[i]))];
  reduce(sum)
}

function magnitude(pair){
	if(!isNaN(pair)) return pair;
	return 3*magnitude(pair[0]) + 2*magnitude(pair[1]);
}

console.log("Part 1", magnitude(sum));

let maxMagnitude = -Infinity;
for(let i = 0; i < pairs.length; i++){
	for(let j = 0; j < pairs.length; j++){
		if(i !== j || false){
			let pairwiseSum = [JSON.parse(JSON.stringify(pairs[i])), JSON.parse(JSON.stringify(pairs[j]))];
			reduce(pairwiseSum)
			maxMagnitude = Math.max(maxMagnitude, magnitude(pairwiseSum))
		}
	}
}
console.log("Part 2", maxMagnitude);