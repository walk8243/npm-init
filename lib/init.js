const func  = require('./func');

module.exports = init = async (initJs) => {
  if(!func.isPackageJson()) await func.execNpmInit();

  const initFile = func.selectInitFile(initJs),
        configData = func.getPackageJson();

  return await func.initPackageJson(initFile, configData).catch(error => { throw error; });
};

