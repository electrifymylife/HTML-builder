const path = require('path');
const fs = require('fs');
const readline = require('readline');

const pathOutput = path.join(__dirname, 'output.txt');
const output = fs.createWriteStream(pathOutput);
output.on('data', (chunk) => output.write(chunk));

console.log('Hello! Enter the text to write it down in a file.');

const rl = readline.createInterface(process.stdin, process.stdout);
rl.prompt();
rl.on('line', (input) => {
  if (input !== 'exit') {
    output.write(input + '\n');
    console.log(`Text added in the file: ${input}`);
    rl.prompt();
  } else {
    console.log('Bye! Check the "output.txt" for the text you have written :)');
    rl.close();
  }
});
rl.on('SIGINT', () => {
  console.log('Bye! Check the "output.txt" for the text you have written :)');
  rl.close();
});
