const initPackage = require('init-package-json'),
      path  = require('path');
const func  = require('./func');

module.exports = init = async () => {
  if(!func.isPackageJson()) await func.execNpmInit();

  const initFile = `${path.dirname(__dirname)}/npm-init.js`,
        configData = func.getPackageJson();

  initPackage(process.cwd(), initFile, configData, function (err, data) {
    if (err) throw err;
  });
};