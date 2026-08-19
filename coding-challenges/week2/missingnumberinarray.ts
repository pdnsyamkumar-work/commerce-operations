const array: number[] = [1, 2, 3, 4, 6];

const n = array.length + 1;

const expectedSum = (n * (n + 1)) / 2;

let actualSum = 0;

for (const num of array) {
    actualSum += num;
}

const missingNumber = expectedSum - actualSum;

console.log("Missing Number:", missingNumber);