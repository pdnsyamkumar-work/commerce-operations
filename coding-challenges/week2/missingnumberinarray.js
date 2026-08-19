var array = [1, 2, 3, 4, 6];
var n = array.length + 1;
var expectedSum = (n * (n + 1)) / 2;
var actualSum = 0;
for (var _i = 0, array_1 = array; _i < array_1.length; _i++) {
    var num = array_1[_i];
    actualSum += num;
}
var missingNumber = expectedSum - actualSum;
console.log("Missing Number:", missingNumber);
