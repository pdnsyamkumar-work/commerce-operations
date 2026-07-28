//1. Second Highest number in an array
function findSecondHighest(arr: number[]): number {
  let firstHigh = Number.NEGATIVE_INFINITY; //11    299
  let secondHigh = Number.NEGATIVE_INFINITY; //-199  11  32

  for (let i = 0; i < arr.length; i++) {
    if (arr[i] > firstHigh) {
      //11>-199  299>11  32>299   31>299
      secondHigh = firstHigh; //-199  11
      firstHigh = arr[i]; //11   299
    } else if (arr[i] > secondHigh && arr[i] < firstHigh) {
      //32>11 && 32<11   31>32 && 31<299(X)
      secondHigh = arr[i]; //32
    }
  }
  return secondHigh;
}
let result = findSecondHighest([11, 299, 32, 31]);
console.log(result);

//=======================================================================================================

//2. Return Frequency count of elements in an array
console.log("Count of elements in an array");
function getFrequency(arr2: number[]) {
  let count: { [key: number]: number } = {};
  for (let i = 0; i <= arr2.length - 1; i++) {
    count[arr2[i]] = (count[arr2[i]] || 0) + 1; //for count
  }
  return count;
}
let arr3: number[] = [12, 32, 21, 3, 12, 32, 3, 12, 12];
let result2 = getFrequency(arr3);
console.log(result2);

//========================================================================================================

//3. Find the first non repeating character in a string
function nonRepeatingCharcater(word: any) {
  for (let i = 0; i <= word.length - 1; i++) {
    let count = 1;
    for (let j = 0; j <= word.length - 1; j++) {
      if (i != j && word[i] == word[j]) {
        count++;
      }
    }
    if (count === 1) {
      return word.charAt(i);
    }
  }
  return "";
}
let result3 = nonRepeatingCharcater("aabccdee");
console.log("First non repeating character: ", result3);
