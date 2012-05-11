"use strict";

var http = require("http");
var https = require("https");
var url = require("url");
var util = require('util');
var async = require("async");
var fs = require("fs");
var proxyify = require("./proxyify");


var request = module.exports = {

  GET: function(options, cb) {
    options.method = "GET";
    doRequest(options, cb);
  },

  PUT: function(options, cb) {
    options.method = "PUT";
    doRequest(options, cb);
  },

  POST: function(options, cb) {
    options.method = "POST";
    doRequest(options, cb);
  }

};

function doRequest (options, cb) {
  var uri = options.uri,
      params = options.params,
      method = options.method,
      cookie = options.login,
      host = options.host,
      etag = options.etag,
      nofollow = options.nofollow,
      nocache = options.nocache;

  console.log(options);


  if (!uri.match(/^(\/)|(https?:\/\/)/)) {
    uri = "/" + uri;
  }

  uri = url.resolve(host, uri);


  var remote = url.parse(uri),
    secure = remote.protocol === "https:",
    port = remote.port || (secure ? 443 : 80),
    hostname = remote.hostname;

  if (port !== (secure ? 443 : 80)) hostname += ":" + port;
  
  var headers = { 
    "accept" : "application/json"
  };

  if (cookie) {
    headers.cookie = "feedhenry=" + cookie + ";";
  }
 
  if (nocache) {
    headers['X-FeedHenry-CacheOff'] = "script_super";
  }

  if (params) {
    delete params._etag;
    if (typeof(params) === 'string') {
      params = new Buffer(params);
    } else {
      params = new Buffer(JSON.stringify(params));
    }
    headers["content-type"] = "application/json";
    headers["content-length"] = params.length;
  } else {
    headers["content-length"] = 0;
  }
  if (etag) {
    headers[method === "GET" ? "if-none-match" : "if-match"] = etag;
  }

  var opts = {
    method: method,
    headers: headers,
    path: (remote.pathname||"/") +
          (remote.search||"") +
          (remote.hash||""),
    host: hostname,
    secure: secure,
    port: port
  };


  var req = (secure ? https : http).request( opts, handleMillicoreResponse(uri, cb) ).on("error", cb);

  req.end(params);

}




function responseHandler(uri, cb) {

  return function(request) {
    var data = "";

    response.on("data", function (chunk) {
      data += chunk;
    });

    response.on("end", function () {
      var parsed;

      if (response.statusCode !== 304) {
        var contentType = response.headers ? response.headers['content-type'] : '';
        
        if (contentType && (contentType.indexOf('application/json') != -1 || contentType.indexOf('text/json') != -1 || contentType.indexOf('text/plain') != -1)) {
          try {
            parsed = JSON.parse(data);
            if (response.headers.etag) {
              // NOTE: not showing etags any longer in returned json (see 4712)
              parsed._etag = response.headers.etag;
            }
          } catch (ex) {
            ex.message += "\n" + data;
            return cb(ex, null, data, response);
          }
        } else {
          parsed = data;
        }
      }
      var er;
      
      if (parsed && parsed.error) {
        var w = url.parse(uri).pathname.substr(1),
            name = w.split("/")[0];
        if (parsed.error === "not_found") {
          er = new Error("404 Not Found: " + name);
        } else {
          er = parsed.error + " " + (parsed.reason || "");
        }
      }

      return cb(er, parsed, data, response);
    }
  };
}

