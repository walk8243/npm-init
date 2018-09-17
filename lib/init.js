const initPackage = require('init-package-json');
const func  = require('./func');

module.exports = init = async (initJs) => {
  if(!func.isPackageJson()) await func.execNpmInit();

  const initFile = func.selectInitFile(initJs),
        configData = func.getPackageJson();

  initPackage(process.cwd(), initFile, configData, function (err, data) {
    if (err) throw err;
  });
};