/* globals i18n */
module.exports = files;
files.list = list;
files.read = read;
files.update = update;
files.create = create;
files.deleteFile = deleteFile;
files.responseToFiles = responseToFiles;

files.desc = i18n._("Manage application files");
files.usage = "\nfhc files [list] <app-id>"
  + "\nfhc files read <file-id>"
  + "\nfhc files update <app-id> <file-id> <file>"
  + "\nfhc files create <app-id> <path> <name> <fileType>"
  + "\nfhc files delete <app-id> <file-id> <path> <name> <fileType>";

var log = require("../../utils/log");
var fhc = require("../../fhc");
var fhreq = require("../../utils/request");
var millicore = require("../../utils/millicore.js");
var fs = require("fs");
var common = require("../../common");
var Table = require('cli-table');
var _ = require('underscore');

// main files entry point
function files(argv, cb) {
  var args = argv._;
  if (args.length === 1) {
    args[0] = fhc.appId(args[0]);
    return list(args[0], cb);
  }

  var action = args.shift();
  //apid and alias checked
  args[0] = fhc.appId(args[0]);

  switch (action) {
    case "read":
      return read(args[0], cb);
    case "list":
    case "ls":
      return list(args[0], cb);
    case "update":
      return update(args[0], args[1], args[2], cb);
    case "create":
      return create(args[0], args[1], args[2], args[3], cb);
    case "delete":
      return deleteFile(args[0], args[1], args[2], args[3], args[4], cb);
    default:
      return unknown(action, cb);
  }
}

// Recursive function that converts the FH files data structure into a hash structure
function responseToFiles(files, file) {
  if (!file) {
    return;
  }

  if (file instanceof Array) {
    for (var i = 0; i < file.length; i++) {
      responseToFiles(files, file[i]);
    }
  }

  if (file && file.type === 'folder') {
    responseToFiles(files, file.children);
  }

  if (file && file.type === 'file') {
    files["." + file.path] = file.guid;
  }
}

// put our apps into table format..
function createTableForFiles(filez) {
  var table = new Table({
    head: ['Name', 'Id'],
    style: common.style()
  });

  _.each(filez, function (id, f) {
    table.push([f, id || 'n/a']);
  });
  return table;
}

//Note: the appId provided here is the instance guid.
//We need the widget id to do file operations.
function list(appId, cb) {
  if (!appId) {
    return cb(i18n._("No appId specified!") + ' ' + i18n._("Usage:\n") + files.usage);
  }

  millicore.widgForAppId(appId, function (err, widgId) {
    if (err) {
      return cb(err);
    }
    log.silly(widgId, "widgId");
    var payload = {payload: {active: "true", app: widgId}, context: {}};
    common.doApiCall(fhreq.getFeedHenryUrl(), "box/srv/1.1/ide/" + fhc.curTarget + "/file/list", payload, i18n._("Error listing file: "), function (err, data) {
      var filez = {};
      responseToFiles(filez, data);
      files.table = createTableForFiles(filez);
      return cb(err, data);
    });
  });
}

//Note: you don't need appId/widgId for reading a file, just the fileId
//itself..
function read(fileId, cb) {
  if (!fileId) {
    return cb(i18n._("No fileId specified!") + ' ' + i18n._("Usage:\n") + files.usage);
  }

  var payload = {payload: {active: "true", guid: fileId}, context: {}};
  common.doApiCall(fhreq.getFeedHenryUrl(), "box/srv/1.1/ide/" + fhc.curTarget + "/file/read", payload, i18n._("Error reading file: "), cb);
}

function update(appId, fileId, file, cb) {
  if (!fileId) {
    return cb(i18n._("No fileId specified!") + ' ' + i18n._("Usage:\n") + files.usage);
  }
  if (!file) {
    return cb(i18n._("No file specified!") + ' ' + i18n._("Usage:\n") + files.usage);
  }
  var apiURL = "box/srv/1.1/ide/" + fhc.curTarget + "/file/update";
  if (typeof file === "string") {
    // If type is string, we're using fs to take contents from a filename
    fs.readFile(file, 'utf8', function (er, data) {
      if (er) {
        log.error(i18n._("File not found: ") + er);
        return cb(er);
      } else {
        var payload = {files: [{guid: fileId, contents: data}], appId: appId};
        common.doApiCall(fhreq.getFeedHenryUrl(), apiURL, payload, i18n._("Error updating file: "), cb);
      }
    });
  } else {
    // If not, it's an object and should have a .fileContents
    if (file.fileContents) {
      var payload = {files: [{guid: fileId, contents: file.fileContents}], appId: appId};
      common.doApiCall(fhreq.getFeedHenryUrl(), apiURL, payload, i18n._("Error updating file: "), cb);
    } else {
      var er = i18n.N_("No file contents specified.");
      log.error(er);
      return cb(i18n._(er));
    }
  }

}

function create(appId, path, name, fileType, cb) {
  if (!appId) {
    return cb(i18n._("No appId specified!") + ' ' + i18n._("Usage:\n") + files.usage);
  }
  millicore.widgForAppId(appId, function (err, widgId) {
    if (err) {
      return cb(err);
    }
    log.silly(widgId, "widgId");
    var payload = {widget: widgId, filePath: path, fileName: name, type: fileType};
    common.doApiCall(fhreq.getFeedHenryUrl(), "box/srv/1.1/ide/" + fhc.curTarget + "/file/create", payload, i18n._("Error creating file: "), cb);
  });
}

function deleteFile(appId, fileId, path, name, type, cb) {
  if (!appId) {
    return cb(i18n._("No appId specified!") + ' ' + i18n._("Usage:\n") + files.usage);
  }
  millicore.widgForAppId(appId, function (err, widgId) {
    if (err) {
      return cb(err);
    }
    log.silly(widgId, "widgId");
    var payload = {type: type, guid: fileId, path: path, name: name, appId: widgId};
    common.doApiCall(fhreq.getFeedHenryUrl(), "box/srv/1.1/ide/" + fhc.curTarget + "/file/delete", payload, i18n._("Error deleting file: "), cb);
  });
}

function unknown(action, cb) {
  cb("Usage:\n" + files.usage);
}

files.completion = function (opts, cb) {
  var argv = opts.conf.argv.remain;
  if (argv[1] !== "files") {
    argv.unshift("files");
  }
  if (argv.length === 2) {
    var cmds = ["list", "read", "update", "create", "delete"];
    if (opts.partialWord !== "l") {
      cmds.push("list");
    }
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
      default:
        return cb(null, []);
    }
  }
};
