let str1: string = "listening";
let str2: string = "silent";

// Convert strings to arrays, sort them, and join back
str1 = str1.split("").sort().join("");
str2 = str2.split("").sort().join("");

// Compare the sorted strings
if (str1 === str2) {
    console.log("Anagram");
} else {
    console.log("Not Anagram");
}