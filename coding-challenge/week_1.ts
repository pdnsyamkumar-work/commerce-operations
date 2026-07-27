//task 1
function findSecondHighest(numbers: number[]): number {
  let highest = -Infinity; //13
  let secondHighest = -Infinity; //13
  for (let i = 1; i < numbers.length; i++) {
    if (numbers[i] > highest) {
      //55>45
      secondHighest = highest; //45
      highest = numbers[i]; //55
    } else if (numbers[i] !== highest && numbers[i] > secondHighest) {
      secondHighest = numbers[i];
    }
  }
  return secondHighest;
}
const result = findSecondHighest([12, 34, 555, 3, 4, 44, 32, 2]);
console.log(result);

//task2
function frequencyCountMap(numbers: number[]) {
  const count = new Map<number, number>();
  for (const num of numbers) {
    const currentCount = count.get(num);
    if (currentCount !== undefined) {
      count.set(num, currentCount + 1);
    } else {
      count.set(num, 1);
    }
  }
  return Object.fromEntries(count);
}
const res1 = frequencyCountMap([33, 55, 22, 44, 44, 44, 11, 33, 44]);
console.log(res1);

//task 3
// function nonrepeatingCharacter(word:string){
//     const count=new Map<string,number>();
//     for(const char of word){
//         const currentCount=count.get(char);
//         if (currentCount){
//             count.set(char,currentCount+1)

//         }
//         else{
//             count.set(char,1);
//         }
//     }
//     return count;

// }
// const res3=nonrepeatingCharacter('hello');
// if (count(res3)==1){

// }
function nonrepeatingCharacter(word: string) {
  const count = new Map();
  for (const char of word) {
    const currentCount = count.get(char);
    if (count.has(char)) {
      count.set(char, currentCount + 1);
    } else {
      count.set(char, 1);
    }
  }
  for (const chars of word) {
    if (count.get(chars) === 1) {
      return chars;
    }
  }
}
const res3 = nonrepeatingCharacter("ppddjjssdeqs");
console.log(res3);
