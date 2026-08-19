let arr: number[] = [1, 5, 20, 8, 16, 20];

let first = -Infinity;
let second = -Infinity;

for (let num of arr) {
    if (num > first) {
        second = first;
        first = num;
    } else if (num > second && num !== first) {
        second = num;
    }
}

console.log("Second Highest Number:", second);