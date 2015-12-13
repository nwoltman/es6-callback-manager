'use strict';

var fs = require('fs');
var os = require('os');

module.exports = function(grunt) {
  grunt.registerTask('fixdocs', 'Fixes any problems with the generated documenation', function() {
    var docs = fs.readFileSync('README.md', 'utf8')
      .replace(/\r\n|\r|\n/g, os.EOL)
      .replace(/([\s\S]{3000,})\1\1/g, '$1');
    fs.writeFileSync('README.md', docs);
    grunt.log.ok('Fixed docs');
  });
};
