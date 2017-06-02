'use strict';

module.exports = function(grunt) {
  require('time-grunt')(grunt);
  require('load-grunt-tasks')(grunt);

  var _ = require('underscore');
  var underscoreDeepExtend = require('underscore-deep-extend');
  _.mixin({deepExtend: underscoreDeepExtend(_)});

  // Project Configuration
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),

    _test_runner: './node_modules/.bin/turbo',
    _unit_args: '--setUp ./test/setupTeardown.js --tearDown ./test/setupTeardown.js test/unit',
    _accept_args: 'test/accept/*',
    unit: ['env NODE_PATH=.:./lib <%= _test_runner %> <%= _unit_args %>/fh3/**/*',
      'env NODE_PATH=.:./lib <%= _test_runner %> <%= _unit_args %>/common/*',
      'env NODE_PATH=.:./lib <%= _test_runner %> <%= _unit_args %>/legacy/*',
      'env NODE_PATH=.:./lib <%= _test_runner %> <%= _unit_args %>/lib/*'
      ],
    accept: 'env NODE_PATH=.:./lib <%= _test_runner %> <%= _accept_args %>',
    unit_cover: 'istanbul cover --dir cov-unit <%= _test_runner %> -- <%= _unit_args %>',
    accept_cover: 'istanbul cover --dir cov-unit <%= _test_runner %> -- <%= _accept_args %>',

    eslint: {
      options: {
        configFile: '.eslintrc.json'
      },
      target: ['lib/**/*.js']
    },

    jsxgettext: {
      pot: {
        files: [
          {
            src: ['lib/**/*.js'],
            dest: 'po/fh-fhc.pot'
          }
        ],
        options: {
          keyword: [
            '_', 'N_'
          ]
        }
      }
    },

    zanata: {
      push: {
        options: {
          url: 'https://translate.zanata.org',
          project: 'fh-fhc',
          'project-version': 'master',
          'project-type': 'gettext'
        },
        files: [
          {src: 'po', type: 'source'}
        ]
      },
      pull: {
        options: {
          url: 'https://translate.zanata.org',
          project: 'fh-fhc',
          'project-version': 'master',
          'project-type': 'gettext'
        },
        files: [
          {src: 'po', type: 'trans'}
        ]
      }
    }
  });

  grunt.loadNpmTasks('grunt-fh-build');
  grunt.loadNpmTasks('grunt-jsxgettext');
  grunt.loadNpmTasks('grunt-zanata-js');

  grunt.registerTask('test', ['eslint','fh:test']);
  grunt.registerTask('unit', ['eslint', 'fh:unit']);
  grunt.registerTask('accept', ['fh:accept']);
  grunt.registerTask('coverage', ['fh:coverage']);
  grunt.registerTask('analysis', ['fh:analysis']);
  grunt.registerTask('potupload', ['jsxgettext:pot', 'zanata:push']);
  grunt.registerTask('dist', ['zanata:pull', 'fh:dist']);
  grunt.registerTask('default', ['fh:default']);
};
