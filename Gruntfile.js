'use strict';

var fs = require('fs');

module.exports = function(grunt) {
  grunt.initConfig({
    eslint: {
      all: ['*.js', 'test/*.js'],
    },

    mochacov: {
      test: {
        options: {
          reporter: 'spec',
        },
      },
      coverage: {
        options: {
          reporter: 'html-cov',
          quiet: true,
          output: 'coverage/coverage.html',
        },
      },
      ciCoverage: {
        options: {
          coveralls: true,
        },
      },
      options: {
        files: 'test/*.js',
        require: 'should',
      },
    },

    jsdoc2md: {
      docs: {
        options: {
          partial: [
            'jsdoc2md/partials/body.hbs',
            'jsdoc2md/partials/examples.hbs',
            'jsdoc2md/partials/link.hbs',
            'jsdoc2md/partials/linked-type-list.hbs',
            'jsdoc2md/partials/params-table.hbs',
            'jsdoc2md/partials/param-table-name.hbs',
            'jsdoc2md/partials/separator.hbs',
          ],
          separators: true,
          'sort-by': ['name'],
          template: fs.readFileSync('jsdoc2md/README.hbs', {encoding: 'utf8'}),
        },
        src: 'callback-manager.js',
        dest: 'README.md',
      },
    },
  });

  grunt.loadNpmTasks('grunt-eslint');
  grunt.loadNpmTasks('grunt-mocha-cov');
  grunt.loadNpmTasks('grunt-jsdoc-to-markdown');

  grunt.registerTask('lint', ['eslint']);
  grunt.registerTask('test', ['mochacov:test'].concat(process.env.CI ? ['mochacov:ciCoverage'] : []));
  grunt.registerTask('coverage', ['mochacov:coverage']);
  grunt.registerTask('doc', ['jsdoc2md']);
  grunt.registerTask('default', ['lint', 'test']);
};
