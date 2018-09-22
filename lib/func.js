const childProcess  = require('child_process'),
      fs    = require('fs'),
      path  = require('path');

const func = {
  getPackageJson,
  selectInitFile,
  isPackageJson,
  isFileExists,
  execNpmInit,
  initPackageJson,
  initPackage: require('init-package-json'),
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
    childProcess.exec('npm init -y', (error, stdout, stderr) => {
      if(error) return reject(error);
      resolve();
    });
  });
}

function initPackageJson(initFile, config) {
  return new Promise((resolve, reject) => {
    func.initPackage(process.cwd(), initFile, config, (err, data) => {
      if(err) return reject(err);
      resolve(data);
    });
  });
}

module.exports = func;
