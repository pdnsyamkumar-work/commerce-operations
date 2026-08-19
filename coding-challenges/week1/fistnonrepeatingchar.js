var s = "mmsaannju";
// Object to store frequency
var frequencys = {};
// Count frequency
for (var _i = 0, s_1 = s; _i < s_1.length; _i++) {
    var char = s_1[_i];
    if (frequencys[char]) {
        frequencys[char]++;
    }
    else {
        frequencys[char] = 1;
    }
}
// Find first non-repeating character
for (var _a = 0, s_2 = s; _a < s_2.length; _a++) {
    var char = s_2[_a];
    if (frequencys[char] === 1) {
        console.log("First Non-Repeating Character:", char);
        break;
    }
}
