
module.exports = files;
files.list = list;
files.read = read;
files.update = update;
files.create = create;
files.responseToFiles = responseToFiles;

files.usage = "\nfhc files [list] <app-id>"
  + "\nfhc files read <file-id>"
  + "\nfhc files update <app-id> <file-id> <file>"
  + "\nfhc files create <app-id> <path> <name> <fileType>"
  + "\nfhc files delete <app-id> <file-id> <path> <name> <fileType>";

var log = require("./utils/log");
var fhc = require("./fhc");
var fhreq = require("./utils/request");
var millicore = require("./utils/millicore.js");
var util = require("util");
var fs = require("fs");
var common = require("./common");
var findit = require('findit');
var Table = require('cli-table');

// main files entry point
function files (args, cb) {
  if (args.length == 1) {
    return list(args[0], cb);
  }

  var action = args.shift();
  //apid and alias checked
  args[0] = fhc.appId(args[0]);

  switch (action) {    
  case "read": return read(args[0], cb);
  case "list": case "ls": return list(args[0], cb);
  case "update": return update(args[0], args[1], args[2], cb);
  case "create": return create(args[0], args[1], args[2], args[3], cb);
  case "delete": return deleteFile(args[0], args[1], args[2], args[3], args[4], cb);
  default: return unknown(action, cb);
  }; 
};

// Recursive function that converts the FH files data structure into a hash structure
function responseToFiles(files, file) {
  if (!file) return;

  if (file instanceof Array) {
    for (var i=0; i<file.length; i++) {
      responseToFiles(files, file[i]);
    }
  }

  if(file && file.type === 'folder') {
    responseToFiles(files, file.children);    
  }

  if (file && file.type == 'file') {
    files["." + file.path] = file.guid; 
  }
};

// put our apps into table format..
function createTableForFiles(filez) {
  // calculate widths
  var maxName=4, maxId=24;

  for (var f in filez) {
    var id = filez[f];
    if(common.strlen(f) > maxName) maxName = common.strlen(f);
    if(common.strlen(id) > maxId) maxId = common.strlen(id);
  }
 
  // create our table
  var table = new Table({ 
    head: ['Name', 'Id'], 
    colWidths: [maxName +2 , maxId + 2],
    style: common.style()
  });
  
  // populate our table
  for (var f in filez) {
    var id = filez[f];
    table.push([f, id]);
  } 
  return table; 
};

//Note: the appId provided here is the instance guid.
//We need the widget id to do file operations.
function list (appId, cb) {
  if (!appId) return cb("No appId specified! Usage:\n" + files.usage);
  
  millicore.widgForAppId(appId, function (err, widgId) {
    if(err) return cb(err);
    log.silly(widgId, "widgId");
    var payload = {payload:{active:"true",app:widgId},context:{}};
    common.doApiCall(fhreq.getFeedHenryUrl(), "box/srv/1.1/ide/" + fhc.domain + "/file/list", payload, "Error listing file: ", function(err, data){
      var filez = {};
      responseToFiles(filez, data);
      //var paths = [];
      //responseToPaths(paths, data);
      files.table = createTableForFiles(filez);
      return cb(err, data);
    });
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
  if (!file) return cb("No file specified! Usage:\n" + files.usage);
  var apiURL = "box/srv/1.1/ide/" + fhc.domain + "/file/update";
  if (typeof file==="string"){
    // If type is string, we're using fs to take contents from a filename
    fs.readFile(file, encoding='utf8', function(er, data) {
      if (er) {
        log.error("File not found: " + er);
        return cb(er);
      }else {
        var payload = {files:[{guid: fileId,contents:data}],appId:appId};
        common.doApiCall(fhreq.getFeedHenryUrl(), apiURL, payload, "Error updating file: ", cb);
      }
    });  
  }else{
    // If not, it's an object and should have a .fileContents
    if (file.fileContents){
      var payload = {files:[{guid: fileId,contents:file.fileContents}],appId:appId};
      common.doApiCall(fhreq.getFeedHenryUrl(), apiURL, payload, "Error updating file: ", cb);
    }else{
      var er = "No file contents specified.";
      log.error(er);
      return cb(er);
    }
  }
  
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
