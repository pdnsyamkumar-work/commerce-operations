let s = "mmsaannju";

// Object to store frequency
let frequencys: { [key: string]: number } = {};

// Count frequency
for (let char of s) {
    if (frequencys[char]) {
        frequencys[char]++;
    } else {
        frequencys[char] = 1;
    }
}

// Find first non-repeating character
for (let char of s) {
    if (frequencys[char] === 1) {
        console.log("First Non-Repeating Character:", char);
        break;
    }
}