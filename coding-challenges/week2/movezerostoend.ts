let ar: number[] = [1, 0, 2, 0, 4, 0, 5,9];

let index: number = 0;

// Move non-zero elements
for (let i = 0; i < ar.length; i++) {
    if (ar[i] !== 0) {
        ar[index] = ar[i];
        index++;
    }
}

// Fill remaining positions with zeros
while (index < ar.length) {
    ar[index] = 0;
    index++;
}

console.log(ar);