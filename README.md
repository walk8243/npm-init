# npm-init
`npm init`の設定をカスタマイズ

## Install
```
npm i walk8243-npminit -g
```

## Usage
```
walk8243-npm-init
```

### Setting File
```
# npm-init.js
module.exports = {
  version : "0.0.0",
  scripts : {
    start : "node ./bin/exec",
    test  : "mocha ./test/mocha --exit",
  },
  license : "ISC",
};

# command line
walk8243-npm-init npm-init.js
```

## License
`walk8243-npminit` is released under the [MIT License](https://github.com/walk8243/npm-init/blob/master/LICENSE)
