'use strict';

module.exports = function(grunt) {
  require('time-grunt')(grunt);
  
  var pkgName = 'fh-fhc';
  var distDir = './dist';
  var outputDir = './output';
  var pkgjs = require('./package.json');
  var buildNumber = (process.env['BUILD_NUMBER'] || 'BUILD-NUMBER');
  var packageVersion = pkgjs.version.replace('BUILD-NUMBER', buildNumber);
  var releaseDir = pkgName + '-' + packageVersion;
  var releaseFile = pkgName + '-' + packageVersion + '.tar.gz';


  // Project Configuration
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    jshint: {
      all: ['lib/*.js', 'lib/cmd/fh3/**/*.js'],
      options: {
        jshintrc: true
      }
    },
    shell: {
      unit: {
        options: {
          stdout: true,
          stderr: true,
          failOnError: true
        },
        command: 'env NODE_PATH=.:./lib ./node_modules/.bin/turbo --setUp ./test/setupTeardown.js --tearDown ./test/setupTeardown.js test/unit/*/*'
      },
      accept: {
        options: {
          stdout: true,
          stderr: true,
          failOnError: true
        },
        // some database trouncing going on here at the moment, tests need to run in a particular order, these all need a refactor
        command:
          'env NODE_PATH=.:./lib ./node_modules/.bin/turbo test/accept/*'
      },
      coverage_unit: {
        options: {
          stdout: true,
          stderr: true,
          failOnError: true
        },
        command: [
          'rm -rf coverage cov-unit',
          'env NODE_PATH=.:./lib ./node_modules/.bin/istanbul cover --dir cov-unit ./node_modules/.bin/turbo --setUp ./test/setupTeardown.js --tearDown ./test/setupTeardown.js test/unit/*/*',
          './node_modules/.bin/istanbul report',
          'echo "See html coverage at: `pwd`/coverage/lcov-report/index.html"'
        ].join('&&')
      },
      coverage_accept: {
        options: {
          stdout: true,
          stderr: true,
          failOnError: true
        },
        command: [
          'rm -rf coverage cov-accept',
          'env NODE_PATH=.:./lib ./node_modules/.bin/istanbul cover --dir cov-accept ./node_modules/.bin/turbo test/accept/*',
          './node_modules/.bin/istanbul report',
          './node_modules/.bin/istanbul report --report cobertura',
          'echo "See html coverage at: `pwd`/coverage/lcov-report/index.html"'
        ].join('&&')
      },
      clean : {
        options: {
          stdout: true,
          stderr: true,
          failOnError: true
        },
        command: 'rm -rf ' + distDir + ' ' + outputDir + ' ' + releaseDir
      },
      dist : {
        options: {
          stdout: true,
          stderr: true,
          failOnError: true
        },
        command: [
          'mkdir -p ' + distDir + ' ' + outputDir + '/' + releaseDir,
          'cp -r ./lib ' + outputDir + '/' + releaseDir,
          'cp -r ./doc ' + outputDir + '/' + releaseDir,
          'cp -r ./bin ' + outputDir + '/' + releaseDir,
          'cp ./package.json ' +  outputDir + '/' + releaseDir,
          'echo ' +  packageVersion + ' > ' + outputDir + '/' + releaseDir + '/VERSION.txt',
          'sed -i -e s/BUILD-NUMBER/' + buildNumber + '/ ' + outputDir + '/' + releaseDir + '/package.json',
          'tar -czf ' + distDir + '/' + releaseFile + ' -C ' + outputDir + ' ' + releaseDir
        ].join('&&')
      }
    },
    plato: {
      src: {
        options : {
          jshint : grunt.file.readJSON('.jshintrc')
        },
        files: {
          'plato': ['lib/**/*.js']
        }
      }
    }
  });

  // Load NPM tasks
  require('load-grunt-tasks')(grunt, {scope: 'devDependencies'});

  // Testing tasks
  grunt.registerTask('test', ['jshint', 'shell:unit', 'shell:accept']);
  grunt.registerTask('unit', ['jshint', 'shell:unit']);
  grunt.registerTask('accept', ['shell:accept']);

  // Coverage tasks
  grunt.registerTask('coverage', ['jshint', 'shell:coverage_unit', 'shell:coverage_accept']);
  grunt.registerTask('coverage-unit', ['shell:coverage_unit']);
  grunt.registerTask('coverage-accept', ['shell:coverage_accept']);

  // Making grunt default to force in order not to break the project.
  grunt.option('force', true);

  grunt.registerTask('analysis', ['plato:src', 'open:platoReport']);

  grunt.registerTask('default', ['test']);
  
  // dist commands
  grunt.registerTask('dist', ['shell:dist', 'shell:clean']);
  grunt.registerTask('clean', ['shell:clean']);
  
  grunt.registerTask('docs', function(){
    var fhc = require('./lib/fhc.js'),
    help = require('./lib/cmd/fhc/help.js'),
    fs = require('fs-extra'),
    path = require('path'),
    async = require('async');
    
    function writeDocFile(usage, cmdPath, cb){
      var splitPath = cmdPath.split(path.sep);
      splitPath = splitPath.slice(1).join(path.sep);
      var writeTo = path.join(__dirname, 'doc', splitPath);
      writeTo = writeTo.replace(/\.js$/, '.md'); // Replace the JS extension with that of a markdown file
      
      fs.outputFile(writeTo, usage, cb);
    }
    
    function genDocs(tree){
      var writerFns = [];
      var keys = Object.keys(tree);
      for (var i=0; i<keys.length; i++){
        var key = keys[i],
        cmd = tree[key];
        
        // If it's a new-style command, push the getter onto the stack-o-getters..
        if (cmd.demand){
          (function(safeClosureCmd){
            writerFns.push(function(cb){
              help.singleCommandUsageToMd(safeClosureCmd, function(err, usage){
                if (err){
                  return cb(err);
                }
                return writeDocFile(usage, safeClosureCmd._path, cb);
              });  
            });  
          })(cmd);
          
        }else if (typeof cmd === 'object'){
          // recurse
          writerFns = writerFns.concat(genDocs(cmd));
        }
      }
      return writerFns;
    };
    
    var done = this.async();
    
    fhc.load(function(conf){
      var writers = genDocs(fhc._tree, done);
      async.parallel(writers, done);      
    });
  });
};
