
module.exports = imports;

imports.usage = 
  "\nfhc import <feedhenry zip file>";

var log = require("./utils/log");
var fhc = require("./fhc");
var fhreq = require("./utils/request");
var common = require("./common");
var util = require('util');
var async = require('async');
var path = require('path');
var fs = require('fs');
var url = require('url');
var https = require('https');

// main import entry point
function imports (args, cb) { 
  if (args.length == 1){
      var file = args[0];
      return importApp(file, cb);
  }else{
    return cb(imports.usage);
  }
};

//
// TODO - Zip file upload this should be more generic, and possibly handled by request.js
//
function importApp(file, cb) {
  if (!path.existsSync(file)) {
    return cb("File doesn't exist: " + file);
  }
  
  log.silly(file, "app import");

  var boundary = Math.random();
  var post_data = [];

  post_data.push(new Buffer(EncodeFieldPart(boundary, 'type', 'feedhenry'), 'ascii'));
  post_data.push(new Buffer(EncodeFieldPart(boundary, 'location', file), 'ascii'));
  post_data.push(new Buffer(EncodeFilePart(boundary, 'application/zip', 'location', file), 'ascii'));

  var file_reader = fs.createReadStream(file, {encoding: 'binary'});
  var file_contents = '';
  file_reader.on('data', function(data){
    file_contents += data;
  });
  file_reader.on('end', function(){
    post_data.push(new Buffer(file_contents, 'binary'));
    post_data.push(new Buffer("\r\n--" + boundary + "--"), 'ascii');
    doUpload(post_data, boundary, cb);
  });
};

// Field encoding
function EncodeFieldPart(boundary,name,value) {
    var return_part = "--" + boundary + "\r\n";
    return_part += "Content-Disposition: form-data; name=\"" + name + "\"\r\n\r\n";
    return_part += value + "\r\n";
    return return_part;
}

// File encoding
function EncodeFilePart(boundary,type,name,filename) {
    var return_part = "--" + boundary + "\r\n";
    return_part += "Content-Disposition: form-data; name=\"" + name + "\"; filename=\"" + filename + "\"\r\n";
    return_part += "Content-Type: " + type + "\r\n\r\n";
    return return_part;
}

// do the actual upload
function doUpload(post_data, boundary, cb) {

  var length = 0;

  for(var i = 0; i < post_data.length; i++) {
    length += post_data[i].length;
  }

  var post_options = {
    host: url.parse(fhreq.getFeedHenryUrl()).hostname,
    port: '443',
    path: '/box/srv/1.1/ide/apps/app/import?location=appanat.zip',
    method: 'POST',
    headers : {
        'Content-Type' : 'multipart/form-data; boundary=' + boundary,
        'Content-Length' : length,
        'Cookie' : "feedhenry=" + fhc.config.get("cookie") + ";"
    }
  };

  var post_request = https.request(post_options, function(response){
    response.setEncoding('utf8');
    var data = '';
    response.on('data', function(chunk){
      data = data + chunk;
    });
    response.on('end', function(){
      log.silly(data, 'app import');

      data = JSON.parse(data);
      if(data.status == 'pending') {
        return common.waitForJob(data.cacheKey, 0, cb);
      }else {
        return cb(undefined, data); 
      }
    });
    response.on('error', function(err) {
      return cb(err);
    });
  });

  for (var i = 0; i < post_data.length; i++) {
    post_request.write(post_data[i]);
  }
  post_request.end();
}


