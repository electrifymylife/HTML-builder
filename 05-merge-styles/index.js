const path = require('path');
const fs = require('fs');
const { readdir } = require('fs/promises');

const pathInput = path.join(__dirname, 'styles');
const pathOutput = path.join(__dirname, 'project-dist', 'bundle.css');
const output = fs.createWriteStream(pathOutput);

const makeStylesBundle = async () => {
  const files = await readdir(pathInput, { withFileTypes: true });
  files.forEach((file) => {
    if (file.isFile() && path.extname(file.name) === '.css') {
      const pathToFile = path.join(pathInput, file.name);
      const readStream = fs.createReadStream(pathToFile, 'utf-8');
      readStream.on('data', (chunk) => {
        output.write(chunk + '\n');
      });
    }
  });
};
makeStylesBundle().catch(console.error);
