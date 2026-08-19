let a= [5, 2, 3, 2, 4, 1, 2, 5];

let frequency: { [key: number]: number } = {};

for (let num of a) {
    if (frequency[num]) {
        frequency[num]++;
    } else {
        frequency[num] = 1;
    }
}

console.log(frequency);