// Find the Missing Number in a Sequential Array (Array Contains Numbers from 1 to n with One Number Missing)
function sequentialArray(arr1: number[]) {
  const n = arr1.length + 1;
  const expectedSum = (n * (n + 1)) / 2;
  let actualSum = 0;
  for (let i = 0; i < arr1.length; i++) {
    actualSum += arr1[i];
  }
  return expectedSum - actualSum;
}
let seqArr = sequentialArray([1, 2, 4, 5]);
console.log(seqArr);

/*  Print a Right-Angled Triangle Star Pattern (Increasing Number of Stars in Each Row)
 *
 **
 ***
 ****
 *****
 */

function rightAngledTraingle(count: number) {
  for (let i = 1; i <= count; i++) {
    let pattern = "";
    for (let j = 1; j <= i; j++) {
      pattern += "*";
    }
    console.log(pattern);
  }
}
rightAngledTraingle(5);

//Move All Zero Values to the End of an Array While Preserving the Order of Non-Zero Elements
function moveZerosToEnd(arr: number[]): number[] {
  let index = 0;
  for (let i = 0; i < arr.length; i++) {
    if (arr[i] !== 0) {
      arr[index] = arr[i];
      index++;
    }
  }
  while (index < arr.length) {
    arr[index] = 0;
    index++;
  }
  return arr;
}
console.log(moveZerosToEnd([1, 0, 2, 0, 3, 4, 0]));

//Determine Whether Two Strings are Anagrams by Comparing Character Frequencies

// FEEDBACK: why we need two seperate functions? we can do it in one function.
function sortString(str: string): string {
  return str.split("").sort().join("");
}

function areAnagrams(str1: string, str2: string): boolean {
  return sortString(str1) === sortString(str2);
}

console.log(areAnagrams("listen", "syam"));
