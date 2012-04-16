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
        responseToFiles(files, file[i]);
      }
    }

    if(file && file.type === 'folder') {
      responseToFiles(files, file.children);    
    }

    if (file && file.type == 'file') {
      files["." + file.path] = file.guid; 
    }
  },

  //Note: the appId provided here is the instance guid.
  //We need the widget id to do file operations.
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


  //Note: you don't need appId/widgId for reading a file, just the fileId
  //itself..
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
    //TODO: tidy this up
    if (typeof file==="string"){
      // If type is string, we're using fs to take contents from a filename
      fs.readFile(file, encoding='utf8', function(err, data) {
        if (err) {
          return cb(err, null);
        } else {
          var payload = {
            files: [{
              guid: fileId,
              contents: data
            }],
            appId: appId
          };

          api.doFileCall(options, "update", payload, "Error updating file: ", cb);
        }
      });  
    } else {
      // If not, it's an object and should have a .fileContents
      if (file.fileContents){
        var payload = {
          files: [{
            guid: fileId,
            contents: file.fileContents
          }],
          appId: appId
        };

        api.doFileCall(options, "update", payload, "Error updating file: ", cb);
      } else {
        return cb(new Error("No file contents specified"), null);
      }
    } 
  },

  create: function(options, appId, path, name, fileType, cb) {
    var payload = {
      app: appId,
      filePath: path,
      fileName: name,
      type:fileType
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

