// Copyright (C) 2017 Alasdair Mercer
//
// Permission is hereby granted, free of charge, to any person obtaining a copy
// of this software and associated documentation files (the "Software"), to deal
// in the Software without restriction, including without limitation the rights
// to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
// copies of the Software, and to permit persons to whom the Software is
// furnished to do so, subject to the following conditions:
//
// The above copyright notice and this permission notice shall be included in all
// copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
// AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
// LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
// OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
// SOFTWARE.

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
