function findMissingNumber(numbers: number[]) {
  //12346
  const n = numbers.length + 1;
  for (let i = 1; i <= n; i++) {
    let found = false;
    for (const num of numbers) {
      if (num === i) {
        found = true;
      }
    }
    if (found === false) {
      return i;
    }
  }
}
const res = findMissingNumber([1, 2, 3, 4, 6, 7, 8, 9]);
console.log(res);

function printRightAngleTriangle(rows: number) {
  for (let i = 1; i <= rows; i++) {
    let stars = "";
    for (let j = 1; j <= i; j++) {
      stars += "*";
    }
    console.log(stars);
  }
}
printRightAngleTriangle(9);

function moveZerosToEnd(numbers: number[]): number[] {
  let index = 0;
  for (let i = 0; i < numbers.length; i++) {
    if (numbers[i] !== 0) {
      numbers[index] = numbers[i];
      index++;
    }
  }
  while (index < numbers.length) {
    numbers[index] = 0;
    index++;
  }
  return numbers;
}
console.log(moveZerosToEnd([33, 0, 4, 0, 64]));

function areAnagrams(str1: string, str2: string): boolean {
  if (str1.length !== str2.length) {
    return false;
  }
  const count = new Map<string, number>();

  for (const char of str1) {
    //cat

    const currentCount = count.get(char) ?? 0; //c:1,a:1,t:1
    count.set(char, currentCount + 1);
  }

  for (const char of str2) {
    //act

    const currentCount = count.get(char); //
    if (currentCount === undefined || currentCount === 0) {
      return false;
    }
    count.set(char, currentCount - 1); //a:0,c:0,t:0
  }
  return true;
}

// Example
console.log(areAnagrams("listen", "silent")); // true
console.log(areAnagrams("aab", "aba")); // true
console.log(areAnagrams("aab", "abb")); // false
console.log(areAnagrams("cat", "act")); // true
console.log(areAnagrams("cat", "dog")); // false
