module.exports = {
  copyAssets: {
    src: [
      '{{SRC}}/assets/**/*',
      '{{ROOT}}/node_modules/jquery/**/*',
    ],
    dest: '{{WWW}}/assets'
  },
  // // Here is my custom script
  copySeletizeJS: {
    src: [
      '{{ROOT}}/node_modules/jquery/dist/jquery.min.js',
      '{{ROOT}}/node_modules/selectize/dist/js/standalone/selectize.js'
    ],
    // Very important, the dest folder to reference from index.html
    dest: '{{WWW}}/assets/js/'
  },
  copySeletizeCSS: {
    src: [
      '{{ROOT}}/node_modules/selectize/dist/css/selectize.css',
      '{{ROOT}}/node_modules/selectize/dist/css/selectize.default.css'
    ],
    // Very important, the dest folder to reference from index.html
    dest: '{{WWW}}/assets/css/'
  },
  // // End Custom Script
  // copyIndexContent: {
  //   src: ['{{SRC}}/index.html', '{{SRC}}/manifest.json', '{{SRC}}/service-worker.js'],
  //   dest: '{{WWW}}'
  // },
  // copyFonts: {
  //   src: ['{{ROOT}}/node_modules/ionicons/dist/fonts/**/*', '{{ROOT}}/node_modules/ionic-angular/fonts/**/*'],
  //   dest: '{{WWW}}/assets/fonts'
  // },
  // copyPolyfills: {
  //   src: ['{{ROOT}}/node_modules/ionic-angular/polyfills/polyfills.js'],
  //   dest: '{{BUILD}}'
  // },
  // copySwToolbox: {
  //   src: ['{{ROOT}}/node_modules/sw-toolbox/sw-toolbox.js'],
  //   dest: '{{BUILD}}'
  // }
}
