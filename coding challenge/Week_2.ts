//Question-1
function findmissingnumber(arr: number[]): number {
  let n = arr.length + 1;
  let expectedsum = (n * (n + 1)) / 2;
  let actualsum = 0;
  for (let i = 0; i < arr.length; i++) {
    actualsum = actualsum + arr[i];
  }
  return expectedsum - actualsum;
}

const numbers = [4, 5, 7, 8];
console.log(findmissingnumber(numbers));

//Question-2
let rows = 5;
for (let i = 1; i <= rows; i++) {
  let star = "";
  for (let j = 1; j <= i; j++) {
    star = star + "*";
  }
  console.log(star);
}

//Question-3
function moveZerostolast(arr: number[]): number[] {
  let index = 0;

  // Move non-zero elements to the front
  for (let i = 0; i < arr.length; i++) {
    if (arr[i] !== 0) {
      arr[index] = arr[i];
      index++;
    }
  }

  // Fill remaining positions with zeros
  while (index < arr.length) {
    arr[index] = 0;
    index++;
  }

  return arr;
}

const arr = [1, 0, 2, 0, 4, 0, 5];

console.log(moveZerostolast(arr));

//Question-4

function areAnagrams(str1: string, str2: string): boolean {
  const sortString = (str: string) =>
    str.toLowerCase().split("").sort().join("");

  return sortString(str1) === sortString(str2);
}

console.log(areAnagrams("listen", "bike"));
