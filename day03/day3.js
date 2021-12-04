const fs = require("fs");
let input = fs.readFileSync("./input.txt", { encoding: "utf-8" });

input = input.split("\n");

function part1() {
  let bits = []; // for each position, the number of [zeroes, ones]
  for (let bitstring of input) {
    for (let index in bitstring) {
      let value = parseInt(bitstring.charAt(index));
      if (!bits[index]) bits[index] = [0, 0];
      bits[index][value]++;
    }
  }

  let gamma = bits.map((e) => (e[0] > e[1] ? 0 : 1)).join("");
  let epsilon = bits.map((e) => (e[0] < e[1] ? 0 : 1)).join("");

  console.log(parseInt(gamma, 2) * parseInt(epsilon, 2));
}

part1();

function part2() {
  // the idea is that everything
  // that starts with a 1 is bigger
  // than everything that starts with
  // a 0, i.e. to the right in a sorted list
  // so whatever is in the middle element must
  // be the majority, and you can kind of binary search.

  // you can't use the middle point as your new left/right, though
  // because if your list looks like 00000001 (where each number represents the index from an entire binary number,
  // so that list really looks like [(0)1001, (0)1101, (0)1100] and so on, if we were looking at index 0)
  // the middle is 0000 | 0001, and if you chop off the right
  // half of that, you lose three potential strings with the correct
  // bit value in the correct position, so you need to scan
  // until you find the very last one that is valid.
  let sorted = input.sort();

  let left = 0;
  let right = sorted.length - 1;

  // find oxygen (most common)
  let currBit = 0;
  while (left < right) {
    let middle = Math.ceil((left + right) / 2); // why ceil? because 1's win ties. 1's will be on the right.

    if (sorted[middle].charAt(currBit) === "0") {
      // if 0 is the most popular
      // then move the right pointer until
      // it exludes all the 1s
      for(let i = middle+1; i <= right; i++){
        if(sorted[i].charAt(currBit) === "1"){
          right = i-1;
          break;
        }
      }
    } else {
      // if 1 is the most popular,
      // then move the left pointer
      // until we exclude all the zeroes
      for(let i = middle-1; i >= left; i--){
        if(sorted[i].charAt(currBit) === "0"){
          left = i+1;
          break;
        }
      }
    }

    currBit++;
  }

  // left == right, if all went well.
  if(left !== right){
    console.error("couldn't find anything, the algorithm is probably wrong");
  }
  let oxygen = sorted[left];


  // find co2 (least common)
  // all that we change is that when we check what's in the middle,
  // we move left and right to exclude them
  currBit = 0;
  left = 0;
  right = sorted.length - 1;
  while (left < right) {
    let middle = Math.ceil((left + right) / 2);

    if (sorted[middle].charAt(currBit) === "0") {
      // this line changes. 0 was the most common,
      // so start at middle and move left until
      // it no longer has that 0
      for(let i = middle+1; i <= right; i++){ 
        if(sorted[i].charAt(currBit) === "1"){
          left = i;
          break;
        }
      }
    } else {
      // same goes, 1 is the most popular,
      // meaning that we need to move the right
      // pointer to the left until it excludes
      // all the 1s
      for(let i = middle-1; i >= left; i--){
        if(sorted[i].charAt(currBit) === "0"){
          right = i;
          break;
        }
      }
    }

    currBit++;
  }

  let co2 = sorted[left];
  console.log(oxygen, co2);
  console.log(parseInt(co2, 2) * parseInt(oxygen, 2));
}
part2();


// this is the very messy bruteforce
// I wrote to get the correct answer
// in order to debug the first part,
// which is how I discovered that
// you can't just use the middle point
// you need to scan instead
function part2bruteforce() {
  let oxygen = new Set(input);

  for (let i = 0; i < input[0].length; i++) {
    let count = {
      "0": 0,
      "1": 0,
    };
    for (let str of Array.from(oxygen)) {
      count[str.charAt(i)]++;
    }

    let best = count["0"] > count["1"] ? "0" : "1";
    for (let str of Array.from(oxygen)) {
      if (str.charAt(i) !== best) {
        oxygen.delete(str);
      }
    }

    if (oxygen.size === 1) break;
  }

  let co2 = new Set(input);
  for (let i = 0; i < input[0].length; i++) {
    let count = {
      "0": 0,
      "1": 0,
    };
    for (let str of Array.from(co2)) {
      count[str.charAt(i)]++;
    }

    let best = count["0"] > count["1"] ? "1" : "0";
    for (let str of Array.from(co2)) {
      if (str.charAt(i) !== best) {
        co2.delete(str);
      }
    }

    if (co2.size === 1) break;
  }

  co2 = Array.from(co2)[0];
  oxygen = Array.from(oxygen)[0];
  console.log(co2, oxygen)
  console.log(parseInt(co2, 2) * parseInt(oxygen, 2));
}
part2bruteforce();
