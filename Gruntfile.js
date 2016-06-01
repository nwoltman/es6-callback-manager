/* eslint-disable camelcase, global-require */

'use strict';

module.exports = function(grunt) {
  require('jit-grunt')(grunt, {
    jsdoc2md: 'grunt-jsdoc-to-markdown',
  })({
    customTasksDir: 'tasks',
  });

  grunt.initConfig({
    eslint: {
      all: ['*.js', 'test/*.js'],
    },

    mochaTest: {
      test: {
        src: 'test/*.js',
      },
      options: {
        colors: true,
        require: ['should'],
      },
    },

    mocha_istanbul: {
      coverage: {
        src: 'test/*.js',
        options: {
          reportFormats: ['html'],
        },
      },
      coveralls: {
        src: 'test/*.js',
        options: {
          coverage: true,
          reportFormats: ['lcovonly'],
        },
      },
      options: {
        mochaOptions: ['--colors'],
        require: ['should'],
      },
    },

    jsdoc2md: {
      docs: {
        options: {
          'global-index-format': 'none',
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
          template: require('fs').readFileSync('jsdoc2md/README.hbs', 'utf8'),
        },
        src: 'es6-callback-manager.js',
        dest: 'README.md',
      },
    },
  });

  grunt.event.on('coverage', (lcov, done) => {
    require('coveralls').handleInput(lcov, done);
  });

  grunt.registerTask('lint', ['eslint']);
  grunt.registerTask('test', [process.env.CI ? 'mocha_istanbul:coveralls' : 'mochaTest']);
  grunt.registerTask('coverage', ['mocha_istanbul:coverage']);
  grunt.registerTask('doc', ['jsdoc2md', 'fixdocs']);
  grunt.registerTask('default', ['lint', 'test']);
};
