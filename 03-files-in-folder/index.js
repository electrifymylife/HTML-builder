const path = require('path');
const fs = require('fs');
const { readdir } = require('fs/promises');

const pathDir = path.join(__dirname, 'secret-folder');
const readFileNames = async () => {
  const files = await readdir(pathDir, { withFileTypes: true });
  files.forEach((file) => {
    const name = file.name;
    const ext = path.extname(name);
    const pathToFile = path.join(pathDir, file.name);
    if (file.isFile()) {
      fs.stat(pathToFile, (err, stats) => {
        if (stats) {
          console.log(
            `${name.replace(ext, '')} - ${ext.replace('.', '')} - ${
              stats.size
            } bytes`,
          );
        }
      });
    }
  });
};
readFileNames().catch(console.error);
