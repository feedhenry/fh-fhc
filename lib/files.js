"use strict";

var fhreq = require("./utils/request");
var util = require("util");
var fs = require("fs");
var api = require("./api");
var apps = require("./apps");

var files = module.exports = {

  // Recursive function that converts the FH files data structure into a hash structure
  responseToFiles: function(files, file) {
    if (!file) return;

    if (file instanceof Array) {
      for (var i=0; i<file.length; i++) {
        files.responseToFiles(files, file[i]);
      }
    }

    if(file && file.type === 'folder') {
      files.responseToFiles(files, file.children);
    }

    if (file && file.type == 'file') {
      files["." + file.path] = file.guid;
    }
  },

  list: function(options, appId, cb) {
    var payload = {
      payload: {
        active: "true",
        app: appId
      },
      context:{}
    };

    api.doFileCall(options, "list", payload, "Error listing file: ", cb);
  },

  read: function(options, fileId, cb) {
    var payload = {
      payload: {
        active: "true",
        guid: fileId
      },
      context: {}
    };

    api.doFileCall(options, "read", payload, "Error reading file: ", cb);
  },

  update: function(options, appId, fileId, file, cb) {
    var payload = {
      files: [{
        guid: fileId
      }],
      appId: appId
    };

    function doUpdate() {
      api.doFileCall(options, "update", payload, "Error updating file: ", cb);
    }

    if (typeof file === "string"){
      // If type is string, we're using fs to take contents from a filename
      fs.readFile(file, 'utf8', function(err, data) {
        if (err) {
          return cb(err, null);
        } else {

          payload.files[0].contents = data;
          doUpdate();

        }
      });
    // If not, it's an object and should have a .fileContents
    } else if (file.fileContents) {

        payload.files[0].contents = file.fileContents;
        doUpdate();

    } else {
      return cb(new Error("No file contents specified"), null);
    }
  },

  create: function(options, appId, path, name, fileType, cb) {
    var payload = {
      filePath: path,
      fileName: name,
      type:fileType,
      widget: appId
    };

    api.doFileCall(options, "create", payload, "Error creating file: ", cb);
  },

  deleteFile: function(options, appId, fileId, path, name, type, cb) {
    var payload = {
      type: type,
      guid: fileId,
      path: path,
      name: name,
      appId: appId
    };

    api.doFileCall(options, "delete", payload, "Error deleting file: ", cb);
  }

};

