const exec  = require('child_process').exec,
      fs    = require('fs');

module.exports = func = {
  getPackageJson,
  isPackageJson,
  isFileExists,
  execNpmInit,
};

function getPackageJson() {
  if(func.isFileExists(process.cwd() + '/package.json')) {
    return JSON.parse(fs.readFileSync(process.cwd() + '/package.json').toString());
  } else return {};
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