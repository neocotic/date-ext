/* eslint-disable global-require */

module.exports = function(grunt) {
  'use strict';

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),

    clean: {
      build: [ 'dist/**' ]
    },

    connect: {
      server: {
        options: {
          base: '.',
          port: 3000
        }
      }
    },

    eslint: {
      target: [
        'lib/**/*.js',
        'test/**/*.js',
        'Gruntfile.js'
      ]
    },

    qunit: {
      all: {
        options: {
          urls: [ 'http://localhost:3000/test/index.html' ]
        }
      }
    },

    uglify: {
      all: {
        files: {
          'dist/date-ext.min.js': 'lib/date-ext.js'
        }
      },
      options: {
        banner: '/*! date-ext v<%= pkg.version %> | (C) <%= grunt.template.today("yyyy") %>  <%= pkg.author.name %> ' +
          '| <%= pkg.license %> License */',
        report: 'min',
        sourceMap: true,
        sourceMapName: 'dist/date-ext.min.map'
      }
    }
  });

  require('load-grunt-tasks')(grunt);

  grunt.registerTask('default', [ 'ci' ]);
  grunt.registerTask('build', [ 'eslint', 'clean:build', 'uglify' ]);
  grunt.registerTask('ci', [ 'eslint', 'clean', 'uglify', 'connect', 'qunit' ]);
  grunt.registerTask('test', [ 'eslint', 'connect', 'qunit' ]);
};
