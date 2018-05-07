// var watch = require('../dist/watch');
var watch = require('@ionic/app-scripts/dist/watch');
// var copy = require('../dist/copy');
// var copyConfig = require('./copy.config');

// this is a custom dictionary to make it easy to extend/override
// provide a name for an entry, it can be anything such as 'srcFiles' or 'copyConfig'
// then provide an object with the paths, options, and callback fields populated per the Chokidar docs
// https://www.npmjs.com/package/chokidar

module.exports = {
  conlluDao: {
    paths: ['{{ROOT}}/node_modules/conllu-dao/dist/*.js'],
    options: { ignored: ['{{SRC}}/**/*.spec.ts', '{{SRC}}/**/*.e2e.ts', '**/*.DS_Store', '{{SRC}}/index.html'] },
    callback: (event, filePath, context)=>{
      "use strict"
      return Promise.all([watch.copyUpdate(event,filePath,context),watch.buildUpdate(event,filePath,context)])
    }
  },
  // copyConfig: copy.copyConfigToWatchConfig()
};
