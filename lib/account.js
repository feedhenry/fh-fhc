"use strict";

var request = require("./utils/request");
var https = require("https");
var http = require("http");
var fs = require("fs");
var path = require("path");
var url = require("url");

var destination = "/box/srv/1.1/dev/account/res/upload";

var thing = module.exports = {

  upload: function(options, source, cb) {

    var sourceDescriptor,
      headers;


    // we got a filename
    if (source && source.filename && source.fields) {
      var filename = source.filename,
        stats = fs.statSync(filename),
        boundary = Math.random(),
        fields = source.fields,
        size = stats.size,
        post_data = "";

      sourceDescriptor = fs.createReadStream(filename, {
        encoding: "binary"
      });
      
      for (var key in fields) {
        post_data += EncodeFieldPart(boundary, key, fields[key]);
      }

      post_data += EncodeFilePart(boundary, 'file', path.basename(filename))

      size += post_data.length + ("\r\n--" + boundary + "--").length;

      headers = {
        'Content-Length': size,
        'Content-Type' : 'multipart/form-data; boundary=' + boundary
      };


    }
    else if (source) {
      sourceDescriptor = source;
      headers = source.headers;
    }
    else {
      return cb(new Error("invalid source"), null);
    }

    headers["cookie"] = "feedhenry=" + options.login + ";";


    request = https.request({
      host: url.parse(options.host).hostname,
      port: 443,
      path: destination,
      headers: headers,
      method: "POST"
    }, function(res) {
      var resText = "";

      res.on("data", function(chunk) {
        resText += chunk.toString();
      });

      res.on("end", function() {
        cb(null, resText)
      });
    });

    if (post_data) {
      request.write(post_data, "ascii");
    }

    sourceDescriptor.on('data', function(chunk) {
      request.write(chunk, "binary");
    });

    sourceDescriptor.on("end", function() {
      if(boundary) {
        request.write("\r\n--" + boundary + "--");
      }
      request.end();
    });

  }

};

// Field encoding
function EncodeFieldPart(boundary,name,value) {
    var return_part = "--" + boundary + "\r\n";
    return_part += "Content-Disposition: form-data; name=\"" + name + "\"\r\n\r\n";
    return_part += value + "\r\n";
    return return_part;
}

// File encoding
function EncodeFilePart(boundary,name,filename) {
    var return_part = "--" + boundary + "\r\n";
    return_part += "Content-Disposition: form-data; name=\"" + name + "\"; filename=\"" + filename + "\"\r\n";
    return_part += "Content-Type: name=application/octet-stream\r\n\r\n";
    return return_part;
}

