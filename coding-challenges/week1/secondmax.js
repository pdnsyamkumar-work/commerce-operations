var arr = [9, 5, 20, 8, 16, 20];
var first = -Infinity;
var second = -Infinity;
for (var _i = 0, arr_1 = arr; _i < arr_1.length; _i++) {
    var num = arr_1[_i];
    if (num > first) {
        second = first;
        first = num;
    }
    else if (num > second && num !== first) {
        second = num;
    }
}
console.log("Second Highest Number:", second);
