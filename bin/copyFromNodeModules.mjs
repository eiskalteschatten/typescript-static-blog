import path from 'node:path';
import fs from 'node:fs';

const pathToNodeModules = path.resolve('node_modules');
const pathToDestination = path.resolve('public', 'libs');

if (!fs.existsSync(pathToDestination)) {
  fs.mkdirSync(pathToDestination);
}

const filesToCopy = {
  prismjs: ['prism.js'],
};

for (const [packageName, files] of Object.entries(filesToCopy)) {
  const destinationFolder = path.resolve(pathToDestination, packageName);

  if (!fs.existsSync(destinationFolder)) {
    fs.mkdirSync(destinationFolder);
  }

  for (const file of files) {
    const source = path.resolve(pathToNodeModules, packageName, file);
    let fileName = file;

    if (file.includes('/')) {
      fileName = file.split('/').pop();
    }

    const destination = path.resolve(destinationFolder, fileName);
    fs.copyFileSync(source , destination);
  }
}
