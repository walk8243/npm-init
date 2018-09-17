const exec  = require('child_process').exec,
      fs    = require('fs'),
      path  = require('path');

module.exports = func = {
  getPackageJson,
  selectInitFile,
  isPackageJson,
  isFileExists,
  execNpmInit,
};

function getPackageJson() {
  if(func.isFileExists(process.cwd() + '/package.json')) {
    return JSON.parse(fs.readFileSync(process.cwd() + '/package.json').toString());
  } else return {};
}

function selectInitFile(initJs) {
  if(initJs) {
    if(func.isFileExists(initJs)) return initJs;
    else console.warn(`'${initJs}' is not exists!`);
  }
  return `${path.dirname(__dirname)}/npm-init.js`;
}

function isPackageJson() {
  if(func.isFileExists(process.cwd() + '/package.json')) return true;
  return false;
}

function isFileExists(filepath) {
  try {
    const stats = fs.statSync(filepath);
    if(stats.isFile()) return true;
  } catch(error) {}
  return false;
}

function execNpmInit() {
  return new Promise((resolve, reject) => {
    exec('npm init -y', (error, stdout, stderr) => {
      if(error) return reject(error);
      resolve();
    });
  });
}