
module.exports = checkout;
checkout.usage = "\nfhc checkout <app-id> [directory]";
checkout.checkoutApp = checkoutApp;

var log = require("./utils/log");
var fhc = require("./fhc");
var util = require("util");
var fs = require("fs");
var path = require('path');
var common = require("./common");
var findit = require('findit');
var Table = require('cli-table');
var files = require('./files');
var async = require('async');

// main checkout entry point
function checkout (args, cb) {
  if (args.length == 1) {
    return checkoutApp(args[0], '.', cb);
  }else if (args.length == 2) {
    if(!path.existsSync(args[1])) {
      return cb(new Error('Directory does not exist: ' + args[1]));
    }
    return checkoutApp(args[0], args[1], cb);
  }else {
    cb("Usage:\n" + checkout.usage);
  }
};

// TODO - check basedir ends with '/'
// TODO - check if ./fhapp exists that its for this project
function checkoutApp(appId, baseDir, cb) {
  log.silly(appId, "Checkout app");
  log.silly(baseDir, "Checkout dir");

  var fhAppFile = baseDir + ".fhapp";
  var fhApp = {
    appId: appId    
  };

  // Check 
  if(path.existsSync(fhAppFile)){
    var proj = readFHAppFile(fhAppFile);
    if (proj.appId !== appId) {
      return cb(new Error("This directory has a different FeedHenry App already cecked out"));
    }
  }

  // list our App files
  files.list(appId, function(err, data){
    if (err) return cb(err);
    var dirs = [];
    getDirectories(dirs, data, baseDir);
    createDirectories(dirs, function(err){
      if(err) return cb(err);
      var filez = [];
      getFiles(filez, data, baseDir);      
      createFiles(filez, function(err) {
        if(err) return cb(err);
        fhapp.files = filez;
        fs.writeFile("./.fhapp", JSON.stringify(fhapp), function(err){
          if(err) return cb(err);
          checkout.message = "App " + appId + " checked out ok";
          return cb(err);
        });
      });
    });
  });
};

function getDirectories(dirs, file, baseDir) {
  if (!file) return;

  if (file instanceof Array) {
    for (var i=0; i<file.length; i++) {
      getDirectories(dirs, file[i]);
    }
  }else {
    if(file && file.type === 'folder') {
      if(file.path !== "") dirs.push(baseDir + file.path);
      getDirectories(dirs, file.children);    
    }
  }
};

function getFiles(filez, file, baseDir) {
  if (!file) return;

  if (file instanceof Array) {
    for (var i=0; i<file.length; i++) {
      getFiles(filez, file[i]);
    }
  }else {
    if(file && file.type === 'file') {
      filez.push({file: baseDir + file.path, guid: file.guid});
    }
  }

  if(file && file.type === 'folder') {    
    getFiles(filez, file.children);    
  }
};

// TODO - assumes parent directories are returned before child dirs
// i.e. '\parent' & '\parent\child' are in that order
// TODO - make async!
function createDirectories(dirs, cb) {
  for (var i=0; i<dirs.length; i++) {
    var d = dirs[i];
    if(!path.existsSync(d)) {
      log.silly(d, "Create dir");
      fs.mkdirSync(d, 0777);
    }
  }
  return cb();
};

function createFiles(files, cb) {
  async.map(files, createFile, function(err, results){
    return cb(err, results);    
  });
};

function createFile(file, cb) {
  log.silly(file, "creating file");
  files.read(file.guid, function(err, data){
    if(err) return cb(err);
    fs.writeFile(file.file, data.contents, function(err){
      return cb(err);      
    });    
  });
};


/*
console.log("Calling findit");
var finder = findit.find('.'); //, function (file) {
//    console.log("findit: " + file);
//});

finder.on('file', function (file, stat) {
  console.log("file: " + util.inspect(file))
  //console.log(stat);
});
*/
