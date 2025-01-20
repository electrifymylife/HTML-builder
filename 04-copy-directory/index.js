const path = require('path');
const { copyFile, mkdir, readdir, rm, constants } = require('fs/promises');

const pathSrc = path.join(__dirname, 'files');
const pathDest = path.join(__dirname, 'files-copy');
const removeFiles = async () => {
  return await rm(pathDest, { recursive: true, force: true });
};
const makeDir = async () => {
  return await mkdir(pathDest, { recursive: true });
};
const copyDir = async () => {
  const files = await readdir(pathSrc);
  console.log('Files copied:');
  console.log('-------------');
  files.forEach((file) => {
    console.log(file);
    const pathToFile = path.join(pathSrc, file);
    copyFile(pathToFile, path.join(pathDest, file), constants.COPYFILE_FICLONE);
  });
};
removeFiles()
  .then(() => makeDir())
  .then(() => copyDir())
  .catch(console.error);
