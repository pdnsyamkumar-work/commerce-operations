function SmallestAndLargestNum(numbers:number[]){
    let smallest=numbers[0];
    let largest=numbers[0];
    for(let i=0;i<numbers.length;i++){
        if(numbers[i]<smallest){
            smallest=numbers[i];
        }
        if(numbers[i]>largest){
            largest=numbers[i];
        }
    }
    return [smallest,largest];
}

console.log(SmallestAndLargestNum([1,2,3,4,5,6,7,8,9]));

function VowelsAndConsonants(text:string){
  let vowels=0;
  let consonants=0;
  for(let i=0;i<text.length;i++){
    if (text[i]==='a'||text[i]==='e'||text[i]==='i'||text[i]==='o'||text[i]==='u'){
        vowels++;  
    }
    else{
        consonants++;
    }
  }
  return [ `VowelsCount:${vowels}`,`ConsonantsCount:${consonants}`];
}

console.log(VowelsAndConsonants("Hello"));
function NestedAndFlatArray(arr:any[]):any[]{
    let res:any[]=[];
    for(const item of arr){
        if(Array.isArray(item)){
           res.push(...NestedAndFlatArray(item));
        }
        else{
            res.push(item);
        }
    }
    return res;
}

console.log(NestedAndFlatArray([1,2,[3,4,[5,6]],7,8]));