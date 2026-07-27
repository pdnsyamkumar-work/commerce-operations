//Find the Missing Number in a Sequential Array (Array Contains Numbers from 1 to n with One Number Missing)

function findMissingNumber(arr: number[]): number {
  const n = arr.length + 1;
  const expectedSum = (n * (n + 1)) / 2;
  const actualSum = arr.reduce((sum, num) => sum + num, 0);

  return expectedSum - actualSum;
}

console.log(findMissingNumber([1, 2, 3, 5]));

//Print a Right-Angled Triangle Star Pattern (Increasing Number of Stars in Each Row)
function printStarPattern(rows: number): void {
  for (let i = 1; i <= rows; i++) {
    console.log("*".repeat(i));
  }
}
printStarPattern(5);

//Move All Zero Values to the End of an Array While Preserving the Order of Non-Zero Elements
function moveZerosToEnd(arr: number[]): number[] {
  const nonZeros = arr.filter((num) => num !== 0);
  const zeros = arr.filter((num) => num === 0);

  return [...nonZeros, ...zeros];
}

console.log(moveZerosToEnd([1, 0, 2, 0, 3, 4, 0]));

//Determine Whether Two Strings are Anagrams by Comparing Character Frequencies
function isAnagram(str1: string, str2: string): boolean {
  if (str1.length !== str2.length) {
    return false;
  }

  const sortedStr1 = str1.split("").sort().join("");
  const sortedStr2 = str2.split("").sort().join("");

  return sortedStr1 === sortedStr2;
}

console.log(isAnagram("listen", "car"));
