var a = [5, 2, 3, 2, 4, 1, 2, 5];
var frequency = {};
for (var _i = 0, a_1 = a; _i < a_1.length; _i++) {
    var num = a_1[_i];
    if (frequency[num]) {
        frequency[num]++;
    }
    else {
        frequency[num] = 1;
    }
}
console.log(frequency);
