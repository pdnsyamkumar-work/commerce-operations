// Reverse an Array with and without using Built-in Methods

function reverseArray(arr: number[]): number[] {
  return arr.reverse();
}

console.log(reverseArray([1, 2, 3, 4, 5]));

// Find the Length of a String Without Using .length

function findStringLength(str: string): number {
  let count = 0;
  for (const char of str) {
    count++;
  }
  return count;
}
console.log("The length of the given string: " + findStringLength("Hello"));

/* Return an array where each element is the product of all other elements.
     Input: [1, 2, 3, 4]
     Output: [24, 12, 8, 6]
*/

function productOfOtherElements(arr: number[]): number[] {
  let totalProduct = 1;
  for (let i = 0; i < arr.length; i++) {
    totalProduct = totalProduct * arr[i];
  }

  const result: number[] = [];
  for (let i = 0; i < arr.length; i++) {
    result.push(totalProduct / arr[i]);
  }
  return result;
}
console.log(productOfOtherElements([1, 2, 3, 4]));

// Find the Largest and Smallest Number in an Array Using Iteration

function findSmallestAndLargestNumberInArray(arr: number[]) {
  let smallNum = arr[0];
  let LargestNum = arr[0];

  for (let i = 0; i < arr.length; i++) {
    if (arr[i] < smallNum) {
      smallNum = arr[i];
    }
    if (arr[i] > LargestNum) {
      LargestNum = arr[i];
    }
  }
  console.log("Largest Number: " + LargestNum);
  console.log("Smallest Number: ", +smallNum);
}
findSmallestAndLargestNumberInArray([10, 2, 32, 21]);

// Count the Number of Vowels and Consonants in a Given String

function countOfVowelsAndConsonents(str: string) {
  let vowels = 0;
  let consonents = 0;

  const str1 = str.toLowerCase();
  for (let i = 0; i < str1.length; i++) {
    if (
      str1[i] == "a" ||
      str1[i] == "e" ||
      str1[i] == "i" ||
      str1[i] == "o" ||
      str1[i] == "u"
    ) {
      vowels++;
    } else {
      consonents++;
    }
  }
  console.log("Vowels count: " + vowels);
  console.log("Consonents count: " + consonents);
}
countOfVowelsAndConsonents("VIshnu");

// Flatten a Nested Array into a Single Array (Handle Multiple Levels of Nesting)
function flattenArray(arr: any[]) {
  let result: any[] = [];
  for (let i = 0; i < arr.length; i++) {
    if (Array.isArray(arr[i])) {
      result = result.concat(flattenArray(arr[i]));
    } else {
      result.push(arr[i]);
    }
  }
  return result;
}
console.log(flattenArray([1, [2, 3], 3, 4, [8]]));
