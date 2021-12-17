const fs = require("fs");
let input = fs.readFileSync("./input.txt", { encoding: "utf-8" });

let inputPacket = input
  .split("")
  .map((bit) => parseInt(bit, 16).toString(2))
  .map((str) => "0".repeat(4 - str.length) + str)
  .reduce((bitString, nybble) => bitString + nybble)
  .split("")
  .map((e) => parseInt(e));

// from a large string, parses the first packet
// and returns the remaining part of the string,
// not part of that packet (useful for side-by-side
// subpackets, where you parse the first packet,
// take what's left over and pass it back into parseFirstPacket,
// until all that's left is garbage)
// returns [value, string without the packet we parsed]
let versionSum = 0;
function parseFirstPacket(bitArray) {
  let version = parseInt([bitArray[0], bitArray[1], bitArray[2]].join(""), 2);
  versionSum += version; // only useful for part 1
  let type = parseInt([bitArray[3], bitArray[4], bitArray[5]].join(""), 2);
  if (type === 4) {
    // a literal value packet
    let binaryString = "";
    let currentGroupStartIndex = 6; // the first index of the data group
    while (true) {
      // will run for each group, and will break after parsing the last group
      let group = [
        bitArray[currentGroupStartIndex + 0],
        bitArray[currentGroupStartIndex + 1],
        bitArray[currentGroupStartIndex + 2],
        bitArray[currentGroupStartIndex + 3],
        bitArray[currentGroupStartIndex + 4],
      ];

      binaryString += "" + group[1] + group[2] + group[3] + group[4];

      if (group[0] === 0) {
        // if we have handled the last group (which always starts with a leading 0)
        let lastIndex = currentGroupStartIndex + 4; // the index of the last bit in the group
        totalLengthOfFirstPacket = lastIndex + 1; // so we know where to start the chopping off of the remaining
        let packetValue = parseInt(binaryString, 2); // take the string we've built out of the groups, get its decimal value

        // chop off the end of the string that isn't part of the packet
        let remainingArray = bitArray.slice(
          totalLengthOfFirstPacket,
          bitArray.length
        ); 

        // we've successfully parsed a literal packet.
        // return that value and return any remaining part 
        // of the bitstring after the packet
        return [packetValue, remainingArray];
      } else {
        // if not the last group, move our index to the start
        // of the next group, continue the loop
        currentGroupStartIndex += 5;
      }
    }
  } else {
    // an operator packet
    let lengthTypeID = bitArray[6];

    // we will have only one of these, depending on the lengthTypeID
    // as determined right below here
    let [lengthOfAllSubpackets, numberOfSubpackets] = [null, null];
    
    // fill in the above array depending on the length type
    let startIndexOfSubpackets;
    if (lengthTypeID === 0) {
      lengthOfAllSubpackets = parseInt(bitArray.slice(7, 7 + 15).join(""), 2);
      startIndexOfSubpackets = 7 + 15;
    } else if (lengthTypeID === 1) {
      numberOfSubpackets = parseInt(bitArray.slice(7, 7 + 11).join(""), 2);
      startIndexOfSubpackets = 7 + 11;
    }


    // split off the version and length from this packet,
    // leaving a string with the subpackets
    // which we will pass into parseFirstPacket again.
    let subpacketsBitString = bitArray.slice(
      startIndexOfSubpackets,
      bitArray.length
    );

    // an array of all the parsed subpackets
    let subpackets = [];

    // parse the first packet, store its result in parseResult,
    // which we will update in each iter of the while loop
    let parseResult = parseFirstPacket(subpacketsBitString);
    let totalSubpacketLength =
      subpacketsBitString.length - parseResult[1].length;
    subpackets.push(parseResult[0]);

    // two conditions, one for each possible type of length we have.
    // one will be null, which will be ignored by the (type && condition)
    while (
      (numberOfSubpackets && subpackets.length < numberOfSubpackets) ||
      (lengthOfAllSubpackets && totalSubpacketLength < lengthOfAllSubpackets)
    ) {
      // keep track of the length of the string we put in, so that we can figure out
      // how many bits long the packet we actually parsed was
      let lengthOfInputPacket = parseResult[1].length + 0;
      // parse the first packet, storing result in parseResult
      parseResult = parseFirstPacket(parseResult[1]);
      // compute the length of the packet by subtracting the length of the string
      // from the length of what was leftover
      totalSubpacketLength += lengthOfInputPacket - parseResult[1].length;
      // push our newly parsed subpacket
      subpackets.push(parseResult[0]);

      // the loop now continues until parseResult no longer has anything useful in it to parse
    }

    let result;
    if (type === 0) {
      // sum packet
      result = subpackets.reduce((acc, el) => acc + el, 0);
    } else if (type === 1) {
      // product packet
      result = subpackets.reduce((acc, el) => acc * el, 1);
    } else if (type === 2) {
      // min packet
      result = Math.min(...subpackets);
    } else if (type === 3) {
      // max packet
      result = Math.max(...subpackets);
    } else if (type === 5) {
      // greater than packet
      if (subpackets.length !== 2)
        throw new Error(
          "Greater than packet did not have exactly two subpackets " +
            subpackets.toString()
        );
      result = subpackets[0] > subpackets[1] ? 1 : 0;
    } else if (type === 6) {
      // less than packet
      if (subpackets.length !== 2)
        throw new Error(
          "Less than packet did not have exactly two subpackets " +
            subpackets.toString()
        );
      result = subpackets[0] < subpackets[1] ? 1 : 0;
    } else if (type === 7) {
      // equal to packet
      if (subpackets.length !== 2)
        throw new Error(
          "Equal to packet did not have exactly two subpackets " +
            subpackets.toString()
        );
      result = subpackets[0] === subpackets[1] ? 1 : 0;
    }

    return [
      result,
      bitArray.slice(
        startIndexOfSubpackets + totalSubpacketLength,
        bitArray.length
      ),
    ];
  }
}

function bothParts() {
  let [value, remainingString] = parseFirstPacket(inputPacket);
  console.log("Part 1: ", versionSum);
  console.log("Part 2: ", value);
}

bothParts();