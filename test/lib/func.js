const assert  = require('assert'),
      childProcess  = require('child_process'),
      fs    = require('fs'),
      initPackage = require('init-package-json'),
      path  = require('path'),
      sinon = require('sinon');
const func  = require('../../lib/func');

describe('func', () => {
  it('内容確認', () => {
    assert.deepEqual(Object.keys(func), [ 'getPackageJson', 'selectInitFile', 'isPackageJson', 'isFileExists', 'execNpmInit', 'initPackageJson', 'initPackage' ]);
    assert.equal(typeof func.getPackageJson, 'function');
    assert.equal(typeof func.selectInitFile, 'function');
    assert.equal(typeof func.isPackageJson, 'function');
    assert.equal(typeof func.isFileExists, 'function');
    assert.equal(typeof func.execNpmInit, 'function');
    assert.equal(typeof func.initPackageJson, 'function');
    assert.deepEqual(func.initPackage, initPackage);
  });

  describe('getPackageJson', () => {
    let stubFuncIsFileExists,
        stubFsReadFileSync,
        stubJsonParse;
    const dummyPackageJson = {
            name: 'walk8243-npminit',
            version: '0.0.0',
            license: 'ISC',
          },
          dummyBuffer = Buffer.from(JSON.stringify(dummyPackageJson));
    before(() => {
      stubFuncIsFileExists = sinon.stub(func, 'isFileExists');
      stubFsReadFileSync = sinon.stub(fs, 'readFileSync');
      stubJsonParse = sinon.stub(JSON, 'parse');
    });
    after(() => {
      stubFuncIsFileExists.restore();
      stubFsReadFileSync.restore();
      stubJsonParse.restore();
    });
    beforeEach(() => {
      stubFuncIsFileExists.returns(true);
      stubFsReadFileSync.returns(dummyBuffer);
      stubJsonParse.returns(dummyPackageJson);
    });
    afterEach(() => {
      stubFuncIsFileExists.reset();
      stubFsReadFileSync.reset();
      stubJsonParse.reset();
    });

    describe('正常系', () => {
      it('package.jsonが存在する', () => {
        const result = func.getPackageJson();
        assert.deepEqual(result, dummyPackageJson);
        assert.ok(stubFuncIsFileExists.calledOnce);
        assert.deepEqual(stubFuncIsFileExists.getCall(0).args, [ process.cwd() + '/package.json' ]);
        assert.ok(stubFsReadFileSync.calledOnce);
        assert.deepEqual(stubFsReadFileSync.getCall(0).args, [ process.cwd() + '/package.json' ]);
        assert.ok(stubJsonParse.calledOnce);
        assert.deepEqual(stubJsonParse.getCall(0).args, [ dummyBuffer.toString() ]);
      });
      it('package.jsonが存在しない', () => {
        stubFuncIsFileExists.returns(false);
        const result = func.getPackageJson();
        assert.deepEqual(result, {});
        assert.ok(stubFuncIsFileExists.calledOnce);
        assert.deepEqual(stubFuncIsFileExists.getCall(0).args, [ process.cwd() + '/package.json' ]);
        assert.ok(stubFsReadFileSync.notCalled);
        assert.ok(stubJsonParse.notCalled);
      });
    });
    describe('異常系', () => {
      it('`isFileExists` is throw', () => {
        stubFuncIsFileExists.throws();
        try {
          func.getPackageJson();
          assert.fail();
        } catch(error) {
          assert.equal(error.name, 'Error');
          assert.equal(error.message, 'Error');
          assert.ok(stubFuncIsFileExists.calledOnce);
          assert.deepEqual(stubFuncIsFileExists.getCall(0).args, [ process.cwd() + '/package.json' ]);
          assert.ok(stubFsReadFileSync.notCalled);
          assert.ok(stubJsonParse.notCalled);
        }
      });
      it('`fs.readFileSync` is throw', () => {
        stubFsReadFileSync.throws();
        try {
          func.getPackageJson();
          assert.fail();
        } catch(error) {
          assert.equal(error.name, 'Error');
          assert.equal(error.message, 'Error');
          assert.ok(stubFuncIsFileExists.calledOnce);
          assert.deepEqual(stubFuncIsFileExists.getCall(0).args, [ process.cwd() + '/package.json' ]);
          assert.ok(stubFsReadFileSync.calledOnce);
          assert.deepEqual(stubFsReadFileSync.getCall(0).args, [ process.cwd() + '/package.json' ]);
          assert.ok(stubJsonParse.notCalled);
        }
      });
      it('`JSON.parse` is throw', () => {
        stubJsonParse.throws();
        try {
          func.getPackageJson();
          assert.fail();
        } catch(error) {
          assert.equal(error.name, 'Error');
          assert.equal(error.message, 'Error');
          assert.ok(stubFuncIsFileExists.calledOnce);
          assert.deepEqual(stubFuncIsFileExists.getCall(0).args, [ process.cwd() + '/package.json' ]);
          assert.ok(stubFsReadFileSync.calledOnce);
          assert.deepEqual(stubFsReadFileSync.getCall(0).args, [ process.cwd() + '/package.json' ]);
          assert.ok(stubJsonParse.calledOnce);
          assert.deepEqual(stubJsonParse.getCall(0).args, [ dummyBuffer.toString() ]);
        }
      });
    });
  });

  describe('selectInitFile', () => {
    let stubFuncIsFileExists,
        stubPathDirname;
    before(() => {
      stubFuncIsFileExists = sinon.stub(func, 'isFileExists');
      stubPathDirname = sinon.stub(path, 'dirname');
    });
    after(() => {
      stubFuncIsFileExists.restore();
      stubPathDirname.restore();
    });
    beforeEach(() => {
      stubFuncIsFileExists.returns(true);
      stubPathDirname.returns('.');
    });
    afterEach(() => {
      stubFuncIsFileExists.reset();
      stubPathDirname.reset();
    });

    it('引数あり・ファイル有', () => {
      const arg = 'exists';
      const result = func.selectInitFile(arg);
      assert.equal(result, arg);
      assert.ok(stubFuncIsFileExists.calledOnce);
      assert.equal(stubFuncIsFileExists.getCall(0).args[0], arg);
    });
    it('引数あり・ファイル無', () => {
      const arg = 'none';
      stubFuncIsFileExists.returns(false);
      stubConsole.warn.callsFake(() => {});
      const result = func.selectInitFile(arg);
      assert.equal(result, './npm-init.js');
      assert.ok(stubFuncIsFileExists.calledOnce);
      assert.equal(stubFuncIsFileExists.getCall(0).args[0], arg);
      assert.ok(stubConsole.warn.calledOnce);
      assert.equal(stubConsole.warn.getCall(0).args[0], `'${arg}' is not exists!`);
      assert.ok(stubConsole.warn.calledAfter(stubFuncIsFileExists));
      stubConsole.warn.resetBehavior();
    });
    it('引数なし', () => {
      const result = func.selectInitFile();
      assert.equal(result, './npm-init.js');
      assert.ok(stubFuncIsFileExists.notCalled);
    });
    describe('異常系', () => {
      it('`isFileExists` is throw', () => {
        const arg = 'exists';
        stubFuncIsFileExists.throws();
        try {
          func.selectInitFile(arg);
          assert.fail();
        } catch(error) {
          assert.equal(error.name, 'Error');
          assert.equal(error.message, 'Error');
          assert.ok(stubFuncIsFileExists.calledOnce);
          assert.equal(stubFuncIsFileExists.getCall(0).args[0], arg);
        }
      });
    });
  });

  describe('isPackageJson', () => {
    let stubFuncIsFileExists,
        stubProcessCwd;
    before(() => {
      stubFuncIsFileExists = sinon.stub(func, 'isFileExists');
      stubProcessCwd = sinon.stub(process, 'cwd');
    });
    after(() => {
      stubFuncIsFileExists.restore();
      stubProcessCwd.restore();
    });
    beforeEach(() => {
      stubFuncIsFileExists.returns(true);
      stubProcessCwd.returns('.');
    });
    afterEach(() => {
      stubFuncIsFileExists.reset();
    });

    it('package.json有', () => {
      const result = func.isPackageJson();
      assert.equal(result, true);
      assert.ok(stubFuncIsFileExists.calledOnce);
      assert.equal(stubFuncIsFileExists.getCall(0).args[0], './package.json');
    });
    it('package.json無', () => {
      stubFuncIsFileExists.returns(false);
      const result = func.isPackageJson();
      assert.equal(result, false);
      assert.ok(stubFuncIsFileExists.calledOnce);
      assert.equal(stubFuncIsFileExists.getCall(0).args[0], './package.json');
    });
    describe('異常系', () => {
      it('`isFileExists` is throw', () => {
        stubFuncIsFileExists.throws();
        try {
          func.isPackageJson();
          assert.fail();
        } catch(error) {
          assert.equal(error.name, 'Error');
          assert.equal(error.message, 'Error');
          assert.ok(stubFuncIsFileExists.calledOnce);
          assert.equal(stubFuncIsFileExists.getCall(0).args[0], './package.json');
        }
      });
    });
  });

  describe('isFileExists', () => {
    let stubFsStatSync,
        stubDummyStatIsFile,
        dummyStat = { isFile: () => {} };
    before(() => {
      stubFsStatSync = sinon.stub(fs, 'statSync');
      stubDummyStatIsFile = sinon.stub(dummyStat, 'isFile');
    });
    after(() => {
      stubFsStatSync.restore();
      stubDummyStatIsFile.restore();
    });
    beforeEach(() => {
      stubFsStatSync.returns(dummyStat);
      stubDummyStatIsFile.returns(true);
    });
    afterEach(() => {
      stubFsStatSync.reset();
      stubDummyStatIsFile.reset();
    });

    it('ファイルの場合', () => {
      const arg = 'normal';
      const result = func.isFileExists(arg);
      assert.ok(result);
      assert.equal(stubFsStatSync.getCall(0).args[0], arg);
      assert.ok(stubDummyStatIsFile.calledOnce);
    });
    it('ファイルでない', () => {
      stubDummyStatIsFile.returns(false);
      const arg = 'NotFile';
      const result = func.isFileExists(arg);
      assert.equal(result, false);
      assert.equal(stubFsStatSync.getCall(0).args[0], arg);
      assert.ok(stubDummyStatIsFile.calledOnce);
    });
    it('存在しない', () => {
      stubFsStatSync.throws();
      const arg = 'none';
      const result = func.isFileExists(arg);
      assert.equal(result, false);
      assert.equal(stubFsStatSync.getCall(0).args[0], arg);
      assert.ok(stubDummyStatIsFile.notCalled);
    });
    it('Statsにエラー', () => {
      stubDummyStatIsFile.throws();
      const arg = 'Stats Error';
      const result = func.isFileExists(arg);
      assert.equal(result, false);
      assert.equal(stubFsStatSync.getCall(0).args[0], arg);
      assert.ok(stubDummyStatIsFile.calledOnce);
    });
  });

  describe('execNpmInit', () => {
    let stubProcessExec;
    before(() => {
      stubProcessExec = sinon.stub(childProcess, 'exec');
    });
    after(() => {
      stubProcessExec.restore();
    });
    beforeEach(() => {
      stubProcessExec
        .onFirstCall().callsFake(() => stubProcessExec.getCall(0).args[1]())
        .callsFake(() => console.log('aaa'));
    });
    afterEach(() => {
      stubProcessExec.reset();
    });

    it('execの実行確認', done => {
      func.execNpmInit()
        .then(() => {
          assert.ok(stubProcessExec.calledOnce);
          assert.equal(stubProcessExec.getCall(0).args[0], 'npm init -y');
          assert.equal(typeof stubProcessExec.getCall(0).args[1], 'function');
          assert.equal(stubProcessExec.getCall(0).args[1].length, 3);
        }).then(done, done);
    });
    it('error発生', done => {
      stubProcessExec
        .onFirstCall().callsFake(() => stubProcessExec.getCall(0).args[1](fakeError(), null, null));
      func.execNpmInit()
        .then(() => assert.fail())
        .catch(error => {
          assert.equal(error.name, 'Error');
          assert.equal(error.message, 'fake Error');
          assert.ok(stubProcessExec.calledOnce);
          assert.equal(stubProcessExec.getCall(0).args[0], 'npm init -y');
          assert.equal(typeof stubProcessExec.getCall(0).args[1], 'function');
          assert.equal(stubProcessExec.getCall(0).args[1].length, 3);
        }).then(done, done);
    });
  });

  describe('initPackageJson', () => {
    let stubFuncInitPackage;
    before(() => {
      stubFuncInitPackage = sinon.stub(func, 'initPackage');
    });
    after(() => {
      stubFuncInitPackage.restore();
    });
    beforeEach(() => {
      stubFuncInitPackage
        .onFirstCall().callsFake(() => stubFuncInitPackage.getCall(0).args[3](undefined, 'ok'))
        .callsFake(() => console.log('aaa'));
    });
    afterEach(() => {
      stubFuncInitPackage.reset();
    });

    it('仮引数なし', done => {
      func.initPackageJson()
        .then(data => {
          assert.equal(data, 'ok');
          assert.ok(stubFuncInitPackage.calledOnce);
          assert.equal(stubFuncInitPackage.getCall(0).args[0], process.cwd());
          assert.equal(stubFuncInitPackage.getCall(0).args[1], undefined);
          assert.equal(stubFuncInitPackage.getCall(0).args[2], undefined);
          assert.equal(typeof stubFuncInitPackage.getCall(0).args[3], 'function');
          assert.equal(stubFuncInitPackage.getCall(0).args[3].length, 2);
        }).then(done, done);
    });
    it('仮引数あり', done => {
      const args = [ 'args1', 'args2' ];
      func.initPackageJson(args[0], args[1])
        .then(data => {
          assert.equal(data, 'ok');
          assert.ok(stubFuncInitPackage.calledOnce);
          assert.equal(stubFuncInitPackage.getCall(0).args[0], process.cwd());
          assert.equal(stubFuncInitPackage.getCall(0).args[1], args[0]);
          assert.equal(stubFuncInitPackage.getCall(0).args[2], args[1]);
          assert.equal(typeof stubFuncInitPackage.getCall(0).args[3], 'function');
          assert.equal(stubFuncInitPackage.getCall(0).args[3].length, 2);
        }).then(done, done);
    });
    it('異常系', done => {
      stubFuncInitPackage
        .onFirstCall().callsFake(() => stubFuncInitPackage.getCall(0).args[3](fakeError(), 'ok'));
      func.initPackageJson()
        .then(() => assert.fail())
        .catch(error => {
          assert.equal(error.name, 'Error');
          assert.equal(error.message, 'fake Error');
          assert.ok(stubFuncInitPackage.calledOnce);
          assert.equal(stubFuncInitPackage.getCall(0).args[0], process.cwd());
          assert.equal(stubFuncInitPackage.getCall(0).args[1], undefined);
          assert.equal(stubFuncInitPackage.getCall(0).args[2], undefined);
          assert.equal(typeof stubFuncInitPackage.getCall(0).args[3], 'function');
          assert.equal(stubFuncInitPackage.getCall(0).args[3].length, 2);
        }).then(done, done);
    });
  });
});
