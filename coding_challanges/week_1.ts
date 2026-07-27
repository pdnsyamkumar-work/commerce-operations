//using functions-- //coding 1 (Find the Second Highest Number in an Array (No Built-in Functions, Single Loop))
function secondhighest(arr: number[]): number {
  let highest = arr[0];
  let secondHighest = arr[0];

  for (let i = 1; i < arr.length; i++) {
    if (arr[i] > highest) {
      secondHighest = highest;
      highest = arr[i];
    } else if (arr[i] > secondHighest && arr[i] !== highest) {
      secondHighest = arr[i];
    }
  }

  return secondHighest;
}

const second_highest = secondhighest([
  10, 20, 5, 30, 25, 60, 70, 80, 90, 100, 95,
]);
console.log("second_highest number:" + second_highest);

//coding 2(Return Frequency Count of Elements in an Array (Using Object/Map))
/*
function frequencyCount(arr: number[]): Map<number, number> 
arr: number[] -->[12, 32, 21, 3, 12, 32, 3, 12]
Map<number, number> --> key value pair key->number , value-number
has() ->Checks whether key already exists.

*/
function frequencyCount(arr: number[]): Map<number, number> {
  let countMap = new Map<number, number>();

  for (let i = 0; i < arr.length; i++) {
    if (countMap.has(arr[i])) {
      countMap.set(arr[i], countMap.get(arr[i])! + 1);
    } else {
      countMap.set(arr[i], 1);
    }
  }

  return countMap;
}

const frequencyCount_result = frequencyCount([12, 32, 21, 3, 12, 32, 3, 12, 1]);

console.log(frequencyCount_result);

// //coding 3(Find the First Non-Repeating Character in a String)
// const str = "aabbccccddeg";
function first_non_repeating_char(str: string): string {
  for (let i = 0; i < str.length; i++) {
    let count = 0;

    for (let j = 0; j < str.length; j++) {
      if (str[i] === str[j]) {
        count++;
      }
    }

    if (count === 1) {
      return str[i];
    }
  }
  return "";
}

const result = first_non_repeating_char("aabbccccddeg");
console.log("first_non_repeating_char:" + result);
