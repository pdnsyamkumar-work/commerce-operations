function reverseArray(numbers: number[]): number[] {
  let left = 0;
  let right = numbers.length - 1;
  while (left < right) {
    let temp = numbers[left];
    numbers[left] = numbers[right];
    numbers[right] = temp;

    left++;
    right--;
  }
  return numbers;
}
console.log(reverseArray([1, 5, 7, 7, 4, 3, 6]));
function reverseArray1(numbers: number[]): number[] {
  return numbers.reverse();
}

console.log(reverseArray([1, 2, 3, 4, 5]));

function lengthOfArray(text: string): number {
  let count = 0;
  let index = 0;
  while (text[index] !== undefined) {
    count++;
    index++;
  }

  return count;
}
console.log(lengthOfArray("bharathreddy"));

function productArray(numbers: number[]) {
  let res: number[] = [];
  for (let i = 0; i < numbers.length; i++) {
    let prod = 1;

    for (let j = 0; j < numbers.length; j++) {
      if (i !== j) {
        prod = prod * numbers[j];
      }
    }
    res.push(prod);
  }
  return res;
}
console.log(productArray([1, 2, 4, 5, 6]));
