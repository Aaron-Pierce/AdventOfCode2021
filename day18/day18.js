const fs = require("fs");
let input = fs.readFileSync("./input.txt", { encoding: "utf-8" });
let pairs = input.split("\n").map((str) => JSON.parse(str));

// reduce mutates snailFishNumber into its reduced form
function reduce(snailFishNumber) {
  // variables to track what the reduction actually did
  // if it did nothing, we're done.
  let hasPerformedAnAction = true;
  // all explodes have to happen before all splits
  // so if we reduce and we didn't explode, but there was
  // an opportunity to split, we'll split it.
  // this remembers the first opportunity to split
  let leftmostSplit = {
    parentArr: [],
    indexToSplit: -1,
  };

  // mutably reduces number, which needs to happen at depth=4
  // The stack is an array of indicies to get to number
  // i.e. snailFishNumber[stack[0]][stack[1]][stack[2]]...[stack[stack.length-1]] === number
  // where number is any value in the snailfish number, either an integer literal or another pair
  function reduce_inner(number, depth, stack) {
    if (!hasPerformedAnAction) {
      if (!isNaN(number)) {
        if (number >= 10) {
          // split an integer literal into [n/2, n/2]
          if (leftmostSplit.indexToSplit === -1) {
            let pointer = snailFishNumber;
            for (let i of stack.slice(0, -1)) {
              pointer = pointer[i];
            }
            leftmostSplit.parentArr = pointer;
            leftmostSplit.indexToSplit = stack[stack.length - 1];
          }
        }
      } else if (depth === 4) {
        // explode a pair. General strategy is to
        // ascend the tree. It's a binary tree, so if you start
        // at some pair [4, 5], and ascend, it will be either
        // [othervalue, [4, 5]] or, [[4, 5], othervalue]
        // We need to add 4 to the first literal left of the pair,
        // and 5 to the first literal right of the pair
        // so we'll see where othervalue is relative to the pair,
        // (by looking at the index of the pair), and then
        // performing the addition

        // remembers if you've already added to the left and right,
        // so that it doesn't happen twice.
        let hasUpdatedLeft = false;
        let hasUpdatedRight = false;

        // loop that climbs the tree
        for (let levelsAbove = 1; levelsAbove <= stack.length; levelsAbove++) {
          // find the parent array of the value being exploded
          let pointer = snailFishNumber;
          for (let i = 0; i < stack.length - levelsAbove; i++) {
            pointer = pointer[stack[i]];
          }

          // as we climb the tree, we're looking for the other
          // side of the pairs, so that we can add to the correct element
          // this index is the index of what is being exploded (or a direct ancestor of it)
          // so that we can figure out the index of what we might be adding to
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
    if (hasPerformedAnAction === false && leftmostSplit.indexToSplit !== -1) {
      // perform split
      let value = leftmostSplit.parentArr[leftmostSplit.indexToSplit];
      leftmostSplit.parentArr[leftmostSplit.indexToSplit] = [
        Math.floor(value / 2),
        Math.ceil(value / 2),
      ];
      hasPerformedAnAction = true;
      leftmostSplit = {
        parentArr: [],
        indexToSplit: -1,
      };
    }
  }
}

let sum = JSON.parse(JSON.stringify(pairs[0]));
for (let i = 1; i < pairs.length; i++) {
  sum = [sum, JSON.parse(JSON.stringify(pairs[i]))];
  reduce(sum);
}

function magnitude(pair) {
  if (!isNaN(pair)) return pair;
  return 3 * magnitude(pair[0]) + 2 * magnitude(pair[1]);
}

console.log("Part 1", magnitude(sum));

let maxMagnitude = -Infinity;
for (let i = 0; i < pairs.length; i++) {
  for (let j = 0; j < pairs.length; j++) {
    let pairwiseSum = [
      JSON.parse(JSON.stringify(pairs[i])),
      JSON.parse(JSON.stringify(pairs[j])),
    ];
    reduce(pairwiseSum);
    maxMagnitude = Math.max(maxMagnitude, magnitude(pairwiseSum));
  }
}
console.log("Part 2", maxMagnitude);
