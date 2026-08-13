//question-1
function findsecondhighestnumber(arr: number[]): number {
  let highest: number = -Infinity;
  let secondhighest: number = -Infinity;
  for (let i = 0; i < arr.length; i++) {
    if (arr[i] > highest) {
      secondhighest = highest;
      highest = arr[i];
    } else if (arr[i] > secondhighest) {
      secondhighest = arr[i];
    }
  }
  return secondhighest;
}
const arr1: number[] = [2, 4, 9, 7, 4];
console.log(findsecondhighestnumber(arr1));

//question-2
function returnfrequencycount(arr: number[]) {
  const freq: { [Key: number]: number } = {};
  for (let i = 0; i < arr.length; i++)
    if (freq[arr[i]]) {
      freq[arr[i]]++;
    } else {
      freq[arr[i]] = 1;
    }
  return freq;
}
const arr2 = [1, 3, 5, 2, 4, 2, 5, 1];
console.log(returnfrequencycount(arr2));

// Question-3
let word = "sravanthi";
function firstnonrepeatingchar(word: string): string {
  let count: { [key: string]: number } = {};

  for (let i = 0; i < word.length; i++) {
    let ch = word[i];
    if (count[ch]) {
      count[ch] = count[ch] + 1;
    } else {
      count[ch] = 1;
    }
  }

  for (let i = 0; i < word.length; i++) {
    if (count[word[i]] == 1) {
      return word[i];
    }
  }
  return "no repeating words";
}
console.log(firstnonrepeatingchar(word));
