
module.exports = files;
files.list = list;
files.read = read;
files.update = update;
files.create = create;

files.usage = "\nfhc files (list) <app id>"
  + "\nfhc files read <file id>"
  + "\nfhc files update <app id> <file id> <file>"
  + "\nfhc files create <app id> <path> <name> <fileType>"
  + "\nfhc files delete <app id> <file id> <path> <name> <fileType>";

var log = require("./utils/log")
, fhc = require("./fhc")
, fhreq = require("./utils/request")
, millicore = require("./utils/millicore.js")
, util = require("util")
, fs = require("fs")
, common = require("./common");

// main files entry point
function files (args, cb) {
  var action = args.shift();
  switch (action) {    
  case "read": return read(args[0], cb);
  case "list": case "ls": return list(args[0], cb);
  case "update": return update(args[0], args[1], args[2], cb);
  case "create": return create(args[0], args[1], args[2], args[3], cb);
  case "delete": return deleteFile(args[0], args[1], args[2], args[3], args[4], cb);
  default: return unknown(action, cb);
  }; 
};

//Note: the appId provided here is the instance guid.
//We need the widget id to do file operations.
function list (appId, cb) {
  if (!appId) return cb("No appId specified! Usage:\n" + files.usage);
  
  millicore.widgForAppId(appId, function (err, widgId) {
    if(err) return cb(err);
    log.silly(widgId, "widgId");
    var payload = {payload:{active:"true",app:widgId},context:{}};
    common.doApiCall(fhreq.getFeedHenryUrl(), "box/srv/1.1/ide/" + fhc.domain + "/file/list", payload, "Error listing file: ", cb);
  });
};


//Note: you don't need appId/widgId for reading a file, just the fileId
//itself..
function read (fileId, cb) {  
  if (!fileId) return cb("No fileId specified! Usage:\n" + files.usage);

  var payload = {payload:{active:"true",guid:fileId},context:{}};
  common.doApiCall(fhreq.getFeedHenryUrl(), "box/srv/1.1/ide/" + fhc.domain + "/file/read", payload, "Error reading file: ", cb);
};

function update (appId, fileId, file, cb){
  if (!fileId) return cb("No fileId specified! Usage:\n" + files.usage);

  fs.readFile(file, encoding='utf8', function(er, data) {
    if (er) {
      log.error("File not found: " + er);
      return cb(er);
    }else {
      var payload = {files:[{guid: fileId,contents:data}],appId:appId};
      common.doApiCall(fhreq.getFeedHenryUrl(), "box/srv/1.1/ide/" + fhc.domain + "/file/update", payload, "Error updating file: ", cb);
    }
  });
};

function create (appId, path, name, fileType, cb){
  if(!appId) return cb("No appId specified! Usage:\n" + files.usage);
  millicore.widgForAppId(appId, function (err, widgId) {
    if(err) return cb(err);
    log.silly(widgId, "widgId");
      var payload = {widget:widgId, filePath:path, fileName:name, type:fileType};
      common.doApiCall(fhreq.getFeedHenryUrl(),"box/srv/1.1/ide/" + fhc.domain + "/file/create", payload, "Error creating file: ", cb);
  });
};

function deleteFile (appId, fileId, path, name, type, cb){
  if(!appId) return cb("No appId specified! Usage:\n" + files.usage);
  millicore.widgForAppId(appId, function (err, widgId) {
    if(err) return cb(err);
    log.silly(widgId, "widgId");
      var payload = {type:type, guid:fileId, path:path, name:name, appId:widgId};
      common.doApiCall(fhreq.getFeedHenryUrl(),"box/srv/1.1/ide/" + fhc.domain + "/file/delete", payload, "Error deleting file: ", cb);
  });
};

function unknown (action, cb) {
  cb("Usage:\n" + files.usage);
}

files.completion = function (opts, cb) {
  var argv = opts.conf.argv.remain;
  if (argv[1] !== "files") argv.unshift("files");
  if (argv.length === 2) {
    var cmds = ["list", "read", "update", "create", "delete"];
    if (opts.partialWord !== "l") cmds.push("list");
    return cb(null, cmds);
  }

  // only complete for the 4'th param, i.e. fhc files list <tab>
  if (argv.length === 3) {
    var action = argv[2];
    switch (action) {
      case "list":
      case "update":
      case "create":
      case "delete":
        common.getAppIds(cb); 
        break;
      default: return cb(null, []);
    }
  }
};