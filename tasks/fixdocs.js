'use strict';

var fs = require('fs');
var os = require('os');

module.exports = function(grunt) {
  grunt.registerTask('fixdocs', 'Fixes any problems with the generated documentation', function() {
    var docs = fs.readFileSync('README.md', 'utf8').replace(/\r\n|\r|\n/g, os.EOL);
    fs.writeFileSync('README.md', docs);
    grunt.log.ok('Fixed docs');
  });
};
