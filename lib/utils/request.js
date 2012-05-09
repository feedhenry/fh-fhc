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

function doRequest (options, cb_) {
  var uri = options.uri,
      params = options.params,
      method = options.method,
      cookie = options.login,
      host = options.host,
      etag = options.etag,
      nofollow = options.nofollow,
      nocache = options.nocache;

  console.log(options);

  // Since there are multiple places where an error could occur,
  // don't let the cb be called more than once.
  var errState = null;
  function cb (er) {
    if (errState) return;
    if (er) errState = er;
    cb_.apply(undefined, arguments);
  }


  if (!uri.match(/^(\/)|(https?:\/\/)/)) {
    uri = "/" + uri;
  }

  uri = url.resolve(host, uri);


  var remote = url.parse(uri),
    secure = remote.protocol === "https:",
    port = remote.port || (secure ? 443 : 80),
    hostname = remote.hostname;
  //  , auth = authRequired && fhc.config.get("_auth")

  if (port !== (secure ? 443 : 80)) hostname += ":" + port;
  
  var headers = { "accept" : "application/json" };
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


  var req = (secure ? https : http).request(opts, function (response) {
    var data = "";

    response.on("data", function (chunk) {
      data += chunk;
    });

    global.newloctimeout = global.newloctimeout || 0;
    response.on("end", function () {
      if (!nofollow && (response.statusCode === 301 || response.statusCode === 302)) {
        // relative redirects SHOULD be disallowed, but alas...
        var newLoc = response.headers.location;
        newLoc = newLoc && url.resolve(uri, newLoc);
        //log.verbose(newLoc, "redirect");
        if (!newLoc) return cb(new Error(
          response.statusCode + " status code with no location"));
        //FIXME: wtf? why does this timeout make it work?
        return setTimeout(function () {
          doRequest();
        }, 1000*(global.newloctimeout ++));
      }
      var parsed;
      if (response.statusCode !== 304) {
        var contentType = response.headers ? response.headers['content-type'] : '';
        if (contentType && (contentType.indexOf('application/json') != -1 || contentType.indexOf('text/json') != -1 || contentType.indexOf('text/plain') != -1)) {
          try {
            parsed = JSON.parse(data);
            if (response.headers.etag) {
              // NOTE: not showing etags any longer in returned json (see 4712)
              // parsed._etag = response.headers.etag;
            }
          } catch (ex) {
            ex.message += "\n" + data;
            return cb(ex, null, data, response);
          }
        }else {
          parsed = data;
        }
      }
      var er;
      
      if (parsed && parsed.error) {
        var w = url.parse(uri).pathname.substr(1),
            name = w.split("/")[0];
        if (parsed.error === "not_found") {
          er = new Error("404 Not Found: "+name);
        } else {
          er = parsed.error + " " + (parsed.reason || "");
        }
      } else if (method !== "HEAD" && method !== "GET") {
        // invalidate cache
        // This is irrelevant for commands that do etag caching, but
        // ls and view also have a timed cache, so this keeps the user
        // from thinking that it didn't work when it did.
        // Note that failure is an acceptable option here, since the
        // only result will be a stale cache for some helper commands.
        // var path = require("path")
        //   , p = url.parse(uri).pathname.split("/")
        //   , _ = "/"
        //   , caches = p.map(function (part) {
        //       return _ = path.join(_, part);
        //     }).map(function (cache) {
        //       return path.join(fhc.cache, cache, ".cache.json");
        //     });
        // TODO asyncMap(caches, rm, function () {});
      }
      return cb(er, parsed, data, response);
    });
  }).on("error", cb);

  req.end(params);

}



