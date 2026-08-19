var ar = [1, 0, 2, 0, 4, 0, 5, 9];
var index = 0;
// Move non-zero elements
for (var i = 0; i < ar.length; i++) {
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
