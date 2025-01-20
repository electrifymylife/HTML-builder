const path = require('path');
const fs = require('fs');
const { copyFile, mkdir, readdir, rm, constants } = require('fs/promises');

const pathDist = path.join(__dirname, 'project-dist');
const pathSrcAssets = path.join(__dirname, 'assets');
const pathDistAssets = path.join(pathDist, 'assets');

const pathSrcStyles = path.join(__dirname, 'styles');
const pathDistStyles = path.join(pathDist, 'style.css');
const pathSrcComponents = path.join(__dirname, 'components');
const pathSrcTemplate = path.join(__dirname, 'template.html');
const pathDistTemplate = path.join(pathDist, 'index.html');
const removeFiles = async (dir) => {
  return await rm(dir, { recursive: true, force: true });
};
const makeDir = async (dir) => {
  return await mkdir(dir, { recursive: true });
};
const copyAssets = async (dirIn, dirOut) => {
  const files = await readdir(dirIn, { withFileTypes: true });
  files.forEach((file) => {
    if (file.isDirectory()) {
      makeDir(path.join(dirOut, file.name));
      copyAssets(path.join(dirIn, file.name), path.join(dirOut, file.name));
    }
    if (file.isFile()) {
      const pathToFile = path.join(dirIn, file.name);
      copyFile(
        pathToFile,
        path.join(dirOut, file.name),
        constants.COPYFILE_FICLONE,
      );
    }
  });
};
const makeStylesBundle = async (dirIn) => {
  const files = await readdir(dirIn, { withFileTypes: true });
  files.forEach((file) => {
    if (file.isFile() && path.extname(file.name) === '.css') {
      const pathToFile = path.join(dirIn, file.name);
      const readStream = fs.createReadStream(pathToFile, 'utf-8');
      const output = fs.createWriteStream(pathDistStyles, { flags: 'a' });
      readStream.on('data', (chunk) => {
        output.write(chunk + '\n');
      });
    }
  });
};
const assembleHtmlTemplates = async (dirComponentsIn, tempIn, tempOut) => {
  const files = await readdir(dirComponentsIn, { withFileTypes: true });

  const readStream = fs.createReadStream(tempIn, 'utf-8');

  readStream.on('data', (chunk) => {
    const temps = [];
    const tempPaths = [];
    let outputMarkup;

    function tempNameMaker(elem) {
      return `{{${elem}}}`.replace(path.extname(elem), '');
    }

    outputMarkup = chunk.split('\n');

    files.forEach((component) => {
      if (component.isFile() && path.extname(component.name) === '.html') {
        temps.push(tempNameMaker(component.name));
        tempPaths.push(component.name);
      }
    });

    let resultMarkup = [];

    tempPaths.forEach((temp, index) => {
      const readStream = fs.createReadStream(
        path.join(dirComponentsIn, tempPaths[index]),
        'utf-8',
      );
      readStream.on('data', (compCode) => {
        resultMarkup =
          resultMarkup.length > 0
            ? resultMarkup.map((line) => line.replace(temps[index], compCode))
            : outputMarkup.map((line) => line.replace(temps[index], compCode));

        const output = fs.createWriteStream(tempOut, { flags: 'w+' });
        output.write(resultMarkup.join('\n'));
      });
    });
  });
};

removeFiles(pathDistAssets)
  .then(() => makeDir(pathDistAssets))
  .catch(console.error)
  .then(() => copyAssets(pathSrcAssets, pathDistAssets))
  .catch(console.error)
  .then(() => makeStylesBundle(pathSrcStyles))
  .catch(console.error)
  .then(() =>
    assembleHtmlTemplates(pathSrcComponents, pathSrcTemplate, pathDistTemplate),
  )
  .catch(console.error);
