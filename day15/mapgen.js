const fs = require('fs');

let map = fs.readFileSync("./input.txt", {encoding: "utf-8"});

map = map.split("\n").map(line => {
    let l = line;
    for(let i = 1; i <= 4; i++){
        l += line.split("").map( f => {
                let incremented = parseInt(f) + i;
                return incremented < 10 ?  incremented : incremented - 9;
            }).join("")
    }
    return l;
});

for(let i = 0; i < 5; i++){
    for(let line of map){
        console.log(
            line.split("").map(f => {
                let incremented = parseInt(f) + i;
                return incremented < 10 ?  incremented : incremented - 9;
            }).join("")
        )
    }
}