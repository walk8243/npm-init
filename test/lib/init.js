const assert = require('assert'),
      initPackage = require('init-package-json'),
      sinon = require('sinon');
const func = require('../../lib/func'),
      init = require('../../lib/init');

describe('init', () => {
  it('内容確認', () => {
    assert.equal(typeof init, 'function');
  });

  describe('init', () => {
    let stubFuncIsPackageJson,
        stubFuncExecNpmInit,
        stubFuncSelectInitFile,
        stubFuncGetPackageJson,
        stubFuncInitPackageJson;
    const dummyPackageJsonData = {
            name    : 'walk8243-npminit',
            version : "0.0.0",
          };
    before(() => {
      stubFuncIsPackageJson   = sinon.stub(func, 'isPackageJson');
      stubFuncExecNpmInit     = sinon.stub(func, 'execNpmInit');
      stubFuncSelectInitFile  = sinon.stub(func, 'selectInitFile');
      stubFuncGetPackageJson  = sinon.stub(func, 'getPackageJson');
      stubFuncInitPackageJson = sinon.stub(func, 'initPackageJson');
    });
    after(() => {
      stubFuncIsPackageJson.restore();
      stubFuncExecNpmInit.restore();
      stubFuncSelectInitFile.restore();
      stubFuncGetPackageJson.restore();
      stubFuncInitPackageJson.restore();
    });
    beforeEach(() => {
      stubFuncIsPackageJson.returns(true);
      stubFuncExecNpmInit.callsFake(() => {});
      stubFuncSelectInitFile.returns('./npm-init.js');
      stubFuncGetPackageJson.returns(dummyPackageJsonData);
      stubFuncInitPackageJson.resolves(dummyPackageJsonData);
    });
    afterEach(() => {
      stubFuncIsPackageJson.reset();
      stubFuncExecNpmInit.reset();
      stubFuncSelectInitFile.reset();
      stubFuncGetPackageJson.reset();
      stubFuncInitPackageJson.reset();
    });

    describe('正常系', () => {
      it('`isPackageJson` is true', done => {
        init()
          .then(data => {
            assert.deepEqual(data, dummyPackageJsonData);
            assert.ok(stubFuncIsPackageJson.calledOnce);
            assert.equal(stubFuncIsPackageJson.getCall(0).args.length, 0);
            assert.ok(stubFuncExecNpmInit.notCalled);
            assert.ok(stubFuncSelectInitFile.calledOnce);
            assert.deepEqual(stubFuncSelectInitFile.getCall(0).args, [ undefined ]);
            assert.ok(stubFuncGetPackageJson.calledOnce);
            assert.equal(stubFuncGetPackageJson.getCall(0).args.length, 0);
            assert.ok(stubFuncInitPackageJson.calledOnce);
            assert.deepEqual(stubFuncInitPackageJson.getCall(0).args, [ stubFuncSelectInitFile.getCall(0).returnValue, stubFuncGetPackageJson.getCall(0).returnValue ]);
            done();
          }).catch(done);
      });
      it('`isPackageJson` is false', done => {
        stubFuncIsPackageJson.returns(false);
        init()
          .then(data => {
            assert.deepEqual(data, dummyPackageJsonData);
            assert.ok(stubFuncIsPackageJson.calledOnce);
            assert.equal(stubFuncIsPackageJson.getCall(0).args.length, 0);
            assert.ok(stubFuncExecNpmInit.calledOnce);
            assert.equal(stubFuncIsPackageJson.getCall(0).args.length, 0);
            assert.ok(stubFuncSelectInitFile.calledOnce);
            assert.deepEqual(stubFuncSelectInitFile.getCall(0).args, [ undefined ]);
            assert.ok(stubFuncGetPackageJson.calledOnce);
            assert.equal(stubFuncGetPackageJson.getCall(0).args.length, 0);
            assert.ok(stubFuncInitPackageJson.calledOnce);
            assert.deepEqual(stubFuncInitPackageJson.getCall(0).args, [ stubFuncSelectInitFile.getCall(0).returnValue, stubFuncGetPackageJson.getCall(0).returnValue ]);
            done();
          }).catch(done);
      });
      it('仮引数を設定', done => {
        const arg = 'arg';
        init(arg)
          .then(data => {
            assert.deepEqual(data, dummyPackageJsonData);
            assert.ok(stubFuncIsPackageJson.calledOnce);
            assert.equal(stubFuncIsPackageJson.getCall(0).args.length, 0);
            assert.ok(stubFuncExecNpmInit.notCalled);
            assert.ok(stubFuncSelectInitFile.calledOnce);
            assert.deepEqual(stubFuncSelectInitFile.getCall(0).args, [ arg ]);
            assert.ok(stubFuncGetPackageJson.calledOnce);
            assert.equal(stubFuncGetPackageJson.getCall(0).args.length, 0);
            assert.ok(stubFuncInitPackageJson.calledOnce);
            assert.deepEqual(stubFuncInitPackageJson.getCall(0).args, [ stubFuncSelectInitFile.getCall(0).returnValue, stubFuncGetPackageJson.getCall(0).returnValue ]);
            done();
          }).catch(done);
      });
    });
    describe('異常系', () => {
      it('`isPackageJson` is throw', done => {
        stubFuncIsPackageJson.throws();
        init()
          .then(() => done(testError))
          .catch(error => {
            assert.equal(error.name, 'Error');
            assert.equal(error.message, 'Error');
            assert.ok(stubFuncIsPackageJson.calledOnce);
            assert.equal(stubFuncIsPackageJson.getCall(0).args.length, 0);
            assert.ok(stubFuncExecNpmInit.notCalled);
            assert.ok(stubFuncSelectInitFile.notCalled);
            assert.ok(stubFuncGetPackageJson.notCalled);
            assert.ok(stubFuncInitPackageJson.notCalled);
            done();
          });
      });
      it('`execNpmInit` is throw', done => {
        stubFuncIsPackageJson.returns(false);
        stubFuncExecNpmInit.throws();
        init()
          .then(() => done(testError))
          .catch(error => {
            assert.equal(error.name, 'Error');
            assert.equal(error.message, 'Error');
            assert.ok(stubFuncIsPackageJson.calledOnce);
            assert.equal(stubFuncIsPackageJson.getCall(0).args.length, 0);
            assert.ok(stubFuncExecNpmInit.calledOnce);
            assert.equal(stubFuncIsPackageJson.getCall(0).args.length, 0);
            assert.ok(stubFuncSelectInitFile.notCalled);
            assert.ok(stubFuncGetPackageJson.notCalled);
            assert.ok(stubFuncInitPackageJson.notCalled);
            done();
          });
      });
      it('`selectInitFile` is throw', done => {
        stubFuncSelectInitFile.throws();
        init()
          .then(() => done(testError))
          .catch(error => {
            assert.equal(error.name, 'Error');
            assert.equal(error.message, 'Error');
            assert.ok(stubFuncIsPackageJson.calledOnce);
            assert.equal(stubFuncIsPackageJson.getCall(0).args.length, 0);
            assert.ok(stubFuncExecNpmInit.notCalled);
            assert.ok(stubFuncSelectInitFile.calledOnce);
            assert.deepEqual(stubFuncSelectInitFile.getCall(0).args, [ undefined ]);
            assert.ok(stubFuncGetPackageJson.notCalled);
            assert.ok(stubFuncInitPackageJson.notCalled);
            done();
          });
      });
      it('`getPackageJson` is throw', done => {
        stubFuncGetPackageJson.throws();
        init()
          .then(() => done(testError))
          .catch(error => {
            assert.equal(error.name, 'Error');
            assert.equal(error.message, 'Error');
            assert.ok(stubFuncIsPackageJson.calledOnce);
            assert.equal(stubFuncIsPackageJson.getCall(0).args.length, 0);
            assert.ok(stubFuncExecNpmInit.notCalled);
            assert.ok(stubFuncSelectInitFile.calledOnce);
            assert.deepEqual(stubFuncSelectInitFile.getCall(0).args, [ undefined ]);
            assert.ok(stubFuncGetPackageJson.calledOnce);
            assert.equal(stubFuncGetPackageJson.getCall(0).args.length, 0);
            assert.ok(stubFuncInitPackageJson.notCalled);
            done();
          });
      });
      it('`initPackageJson` is reject', done => {
        stubFuncInitPackageJson.rejects();
        init()
          .then(() => done(new Error()))
          .catch(error => {
            assert.equal(error.name, 'Error');
            assert.equal(error.message, 'Error');
            assert.ok(stubFuncIsPackageJson.calledOnce);
            assert.equal(stubFuncIsPackageJson.getCall(0).args.length, 0);
            assert.ok(stubFuncExecNpmInit.notCalled);
            assert.ok(stubFuncSelectInitFile.calledOnce);
            assert.deepEqual(stubFuncSelectInitFile.getCall(0).args, [ undefined ]);
            assert.ok(stubFuncGetPackageJson.calledOnce);
            assert.equal(stubFuncGetPackageJson.getCall(0).args.length, 0);
            assert.ok(stubFuncInitPackageJson.calledOnce);
            done();
          });
      });
    });
  });
});


