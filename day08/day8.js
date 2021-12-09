const fs = require("fs");
let input = fs.readFileSync("./input.txt").toString();

input = input.split("\n");


function getAllOutputs(){

  let outputs = [];

  for (let line of input) {
    let [signalPattern, outputSignals] = line.split(" | ");
    signalPattern = signalPattern.split(" ");
    outputSignals = outputSignals.split(" ");
    signalPattern.push(...outputSignals)

    let wireNames = "abcdefg".split("");

    // our goal is to create a 1-to-1 mapping
    // from names of wires to names of segments.
    // we will process of elimination that map.
    let possibleWireDestinations = {};
    for (let name of wireNames) {
      possibleWireDestinations[name] = new Set(wireNames); // anything could go anywhere
    }

    for (let signal of signalPattern) {
      let segmentsUniqueToEachLength = {
        0: [],
        1: [],
        2: "cf".split(""),
        3: "acf".split(""),
        4: "bcdf".split(""),
        5: "abcdefg".split(""), // not so helpful, these three.
        6: "abcdefg".split(""),
        7: "abcdefg".split(""),
      };
      for (let wire of signal) {
        // console.log("testing", wire, possibleWireDestinations);
        
        possibleWireDestinations[wire] = new Set(
          Array.from(possibleWireDestinations[wire]).filter(
            (destination) =>
              segmentsUniqueToEachLength[signal.length].indexOf(destination) 
                !== -1
          )
        );


        if(signal.length < 5){
          // lengths 2, 3, and 4, are unique. 
          // if you are given a signal with 2 wires
          // those are the ONLY wires that could be C and F, so remove them from
          // everything else.

          let complementofWholeSignal = "abcdefg".split("").filter(e => signal.indexOf(e) === -1);
          // console.log("complement: ", complementofWholeSignal);
          for(let otherWire of complementofWholeSignal){
            // console.log("otherWire: ", otherWire, possibleWireDestinations[otherWire]);
            for(let char of segmentsUniqueToEachLength[signal.length]){
              possibleWireDestinations[otherWire].delete(char);
            }
          }
        }
          
        // console.log("for signal", signal, "new possible destinations: ", possibleWireDestinations);
        if(possibleWireDestinations[wire].size === 1){
          let whereThisWireMustGoTo = Array.from(possibleWireDestinations[wire])[0];
          // this wire MUST map to this destination,
          // so nothing else can map there
          for(let otherWire in possibleWireDestinations){
            if(otherWire !== wire){
              possibleWireDestinations[otherWire].delete(whereThisWireMustGoTo)
            }
          }
        }
      }
    }

    // console.log("First pass mappings: ", possibleWireDestinations);

    let signalsByLength = signalPattern.sort((a, b) => a.length - b.length);
    let left = 0;
    let right = 0;
    while(left < signalsByLength.length){
      while(right < signalsByLength.length && signalsByLength[left].length === signalsByLength[right].length){
        right++;
      }
      right--;

      let uniqueSignalsOfLength = new Set();

      //now left is the first in the group, and right is the second
      let intersectionOfWires;
      for(let i = left; i <= right; i++){
        let signalInLengthGroup = signalsByLength[i];
        if(intersectionOfWires === undefined) intersectionOfWires = signalInLengthGroup.split("");
        else{
          intersectionOfWires = intersectionOfWires.filter(e => signalInLengthGroup.indexOf(e) !== -1)
        }
        uniqueSignalsOfLength.add(signalInLengthGroup.split("").sort().join(""))
      }

      // console.log("for length: ", signalsByLength[left].length, "intersection among all is", intersectionOfWires);
      // console.log("Unique signals for length:", uniqueSignalsOfLength);


      if(signalsByLength[left].length === 5 || signalsByLength[left].length === 6){
        if(uniqueSignalsOfLength.size === 3){
          for(let wire of intersectionOfWires){
            if(signalsByLength[left].length === 5){
              // if you are in ALL 5 length signals,
              // you cannot possibly be b, f, c, or e,
              // because each of those is absent in some
              // 5 length segment's signal
              possibleWireDestinations[wire].delete("b");
              possibleWireDestinations[wire].delete("f");
              possibleWireDestinations[wire].delete("c");
              possibleWireDestinations[wire].delete("e");

            }else if(signalsByLength[left].length === 6){
              possibleWireDestinations[wire].delete("d");
              possibleWireDestinations[wire].delete("e");
              possibleWireDestinations[wire].delete("c");
            }

            if(possibleWireDestinations[wire].size === 1){
              let wireItMustBe = Array.from(possibleWireDestinations[wire])[0];
              // console.log("Found new unique", wireItMustBe);
              for(let otherWire in possibleWireDestinations){
                if(otherWire !== wire){
                  possibleWireDestinations[otherWire].delete(wireItMustBe)
                }
              }
            }
          }
        }
      }

      right++;
      left = right;

    }
    // console.log(signalsByLength);


    // console.log("final possible destinations after second pass:");
    // console.log(possibleWireDestinations);

    // console.log("Converting signal: ");
    let converted = outputSignals.map(signalString => signalString.split("").map(wire => Array.from(possibleWireDestinations[wire])[0]).sort().join(""))
    let toDigitMap = {
      'abcefg': '0',
      'cf': '1',
      'acdeg': '2',
      'acdfg': '3',
      'bcdf': '4',
      'abdfg': '5',
      'abdefg': '6',
      'acf': '7',
      'abcdefg': '8',
      'abcdfg': '9'
    }
    let outputDigits = converted.map(e => toDigitMap[e])
    outputs.push(outputDigits);
  }
  return outputs
}

function part1() {
  let outputs = getAllOutputs();
  
  let digitCounts = new Array(10).fill(0);
  for(let output of outputs){
    for(let digit of output){
      digitCounts[digit]++;
    }
  }

  console.log(digitCounts[1] + digitCounts[4] + digitCounts[7] + digitCounts[8]);
}

part1();

function part2() {
  let outputs = getAllOutputs();
  
  let totalSum = 0;
  for(let output of outputs){
    totalSum += parseInt(output.join(""))
  }

  console.log(totalSum);
}

part2();
