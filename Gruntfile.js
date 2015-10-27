'use strict';

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
  });

  grunt.loadNpmTasks('grunt-eslint');
  grunt.loadNpmTasks('grunt-mocha-cov');

  grunt.registerTask('lint', ['eslint']);
  grunt.registerTask('test', ['mochacov:test'].concat(process.env.CI ? ['mochacov:ciCoverage'] : []));
  grunt.registerTask('coverage', ['mochacov:coverage']);
  grunt.registerTask('default', ['lint', 'test']);
};
