
module.exports = request;
request.GET = GET;
request.MULTIGET = MULTIGET;
request.PUT = PUT;
request.POST = POST;
request.upload = upload;
request.uploadFile = uploadFile;
request.getFeedHenryUrl = getFeedHenryUrl;
request.getMessagingUrl = getMessagingUrl;
request.requestFunc = doRequest;

var fhc = require("../fhc");
var http;
var https;
var url = require("url");
var util = require('util');
var async = require("async");
var log = require("./log");
var ini = require("./ini");
var fs = require("fs");
var proxyify = require("./proxyify");

function request(){};

function doRequest (fhurl, method, where, what, etag, nofollow, cb_) {
  log.verbose(where||"/", method);  

  if (where.match(/^\/?favicon.ico/)) {
    return cb_(new Error("favicon.ico isn't a package, it's a picture."));
  }
  if (typeof cb_ !== "function") cb_ = nofollow, nofollow = false;
  if (typeof cb_ !== "function") cb_ = etag, etag = null;
  if (typeof cb_ !== "function") cb_ = what, what = null;

  if (fhurl instanceof Error) return cb_(fhurl);
  log.verbose(fhurl, "url");

  // Since there are multiple places where an error could occur,
  // don't let the cb be called more than once.
  var errState = null;
  function cb (er) {
    if (errState) return;
    if (er) errState = er;
    cb_.apply(undefined, arguments);
  }

  // TODO - tidy..
  if (!where.match(/^https?:\/\//)) {
    log.verbose(where, "raw, before any munging");
    if (where.charAt(0) !== "/") where = "/" + where;
    log.verbose([fhurl, where], "url resolving");
    where = url.resolve(fhurl, where);
    log.verbose(where, "url resolved");
  } else {
    log.verbose(where, "no need to resolve");
  }

  var remote = url.parse(where)
    , secure = remote.protocol === "https:"
    , port = remote.port || (secure ? 443 : 80)
    , hostname = remote.hostname;
  //  , auth = authRequired && fhc.config.get("_auth")

  log.verbose(remote, "url parsed");
  if (port !== (secure ? 443 : 80)) hostname += ":" + port;
  log.silly(port, "port");
  
  var headers = { "accept" : "application/json" };
  var cookie = fhc.config.get("cookie");
  if (cookie != undefined) {    
    headers.cookie = "feedhenry=" + cookie + ";";
    log.silly(headers.cookie, "cookie");
  } 
 
  log.silly(fhc.config.get('nocache'), "nocache");
  if (fhc.config.get('nocache')) {
    headers['X-FeedHenry-CacheOff'] = "script_super";
  }

  if (what) {
    if (what instanceof File) {
      log.verbose(what.name, "uploading");
      headers["content-type"] = "application/octet-stream";      
    } else {
      delete what._etag;
      log.silly(what,"writing json");
      if (typeof(what) === 'string') {
        what = new Buffer(what);
      }else {
        what = new Buffer(JSON.stringify(what));
      }
      headers["content-type"] = "application/json";
    }
    headers["content-length"] = what.length;
  } else {
    headers["content-length"] = 0;
  }
  if (etag) {
    log.verbose(etag, "etag");
    headers[method === "GET" ? "if-none-match" : "if-match"] = etag;
  }

  if (!remote.protocol) log.warn(remote, "No protocol?");

  var opts = { method: method
             , headers: headers
             , path: (remote.pathname||"/")
                   + (remote.search||"")
                   + (remote.hash||"")
             , host: remote.hostname
             , secure: remote.protocol
                       && remote.protocol.toLowerCase() === "https:"
             , port: remote.port
             };
  if (!opts.port) opts.port = opts.secure ? 443 : 80;
  if (opts.port !== (opts.secure ? 443 : 80)) {
    opts.headers.host = opts.headers.host || opts.host;
    opts.headers.host += ":" + opts.port;
  }

  opts = proxyify(fhc.config.get("proxy"), remote, opts);
  if (!opts) return cb(new Error("Bad proxy config: "+fhc.config.get("proxy")));

  if (opts.secure) https = https || require("https");
  else http = http || require("http");
  log.silly(headers, "headers");

  var req = (opts.secure ? https : http).request(opts, function (response) {
    log.verbose(where, "response");
    // if (response.statusCode !== 200) return cb(new Error(
    //   "Status code " + response.statusCode + " from PUT "+where))
    var data = "";
    response.on("error", log.er(cb, "response error from "+where));
    response.on("data", function (chunk) {
      log.silly(chunk+"", "chunk");
      data += chunk;
    });
    global.newloctimeout = global.newloctimeout || 0;
    response.on("end", function () {
      if (!nofollow
          && (response.statusCode === 301 || response.statusCode === 302)) {
        // relative redirects SHOULD be disallowed, but alas...
        var newLoc = response.headers.location;
        newLoc = newLoc && url.resolve(where, newLoc);
        log.verbose(newLoc, "redirect");
        if (!newLoc) return cb(new Error(
          response.statusCode + " status code with no location"));
        //FIXME: wtf? why does this timeout make it work?
        return setTimeout(function () {
          log.verbose(newLoc, "redirect fer reals");
          requestFunc(method, newLoc, what, etag, log.er(cb, "Failed to fetch "+newLoc));
        }, 1000*(global.newloctimeout ++));
      }
      var parsed;
      if (response.statusCode !== 304) {
        //console.log("HEADERS: " + util.inspect(response.headers['content-type']));
        //console.log("DATA: " + data);
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
            log.verbose(data, "bad json");
            log.error("error parsing json", "FeedHenry");
            return cb(ex, null, data, response);
          }         
        }else {          
          parsed = data;
        }
      }
      var er = undefined;
      
      if (parsed && parsed.error) {
        var w = url.parse(where).pathname.substr(1)
          , name = w.split("/")[0];
        if (parsed.error === "not_found") {
          er = new Error("404 Not Found: "+name);
        } else {
          er = new Error(parsed.error + " " + (parsed.reason || "") + ": " + w);
        }
      } else if (method !== "HEAD" && method !== "GET") {
        // invalidate cache
        // This is irrelevant for commands that do etag caching, but
        // ls and view also have a timed cache, so this keeps the user
        // from thinking that it didn't work when it did.
        // Note that failure is an acceptable option here, since the
        // only result will be a stale cache for some helper commands.
        var path = require("path")
          , p = url.parse(where).pathname.split("/")
          , _ = "/"
          , caches = p.map(function (part) {
              return _ = path.join(_, part);
            }).map(function (cache) {
              return path.join(fhc.cache, cache, ".cache.json");
            });
        // TODO asyncMap(caches, rm, function () {});
      }
      return cb(er, parsed, data, response);
    });
  }).on("error", cb);

  if (what instanceof File) {
    var size = Math.min(what.length, 1024*1024*1024)
      , remaining = what.length;
    log.verbose(what.length, "bytes")
    ;(function W () {
      var b = new Buffer(size);
      try {
        var bytesRead = fs.readSync(what.fd, b, 0, b.length, null);
      } catch (er) {
        return log.er(cb, "Failure to read file")(er);
      }
      remaining -= bytesRead;
      if (bytesRead) {
        log(bytesRead, "read");
        log(remaining, "remain");
        return (
            req.write(bytesRead === b.length ? b : b.slice(0, bytesRead))
          ) ? W()
            : req.on("drain", function DRAIN () {
                log.silly(remaining, "drain");
                req.removeListener("drain", DRAIN);
                W();
              });
      }
      if (!remaining) {
        req.end();
        log.verbose(what.name, "written to uploading stream");
        log.verbose("Not done yet! If it hangs/quits now, it didn't work.", "upload");
        return;
      }
      // wtf!? No bytes read, but also bytes remaining.
      return cb(new Error("Some kind of weirdness reading the file"));
    })();
    return

  } else if (typeof what === "string" || Buffer.isBuffer(what)) {
    // just a json blob
    req.write(what);
  }

  req.end();
}

function GET (url, where, etag, nofollow, cb) {
  request.requestFunc(url, "GET", where, null, etag, nofollow, cb);
}

function PUT (url, where, what, etag, nofollow, cb) {
  request.requestFunc(url, "PUT", where, what, etag, nofollow, cb);
}

function POST (url, where, what, etag, nofollow, cb) {
  request.requestFunc(url, "POST", where, what, etag, nofollow, cb);
}

function MULTIGET (fhurls, where, cb) {
  var urls = fhurls.split(',');
  var ret = new Object();

  function doGetUrl(url, callback) {
    request.requestFunc(url, "GET", where, null, null, function(er, parsed, data, response) {   
      callback(er, data);
    });
  }

  async.map(urls, doGetUrl, function(err, results) {
    if (err) return cb(err);
    for (var i=0; i<urls.length; i++) {
      ret[urls[i]] = results[i];
    }
    return cb(err, ret, ret, ret);
  });
}

function upload (url, where, filename, etag, nofollow, cb) {
  if (typeof nofollow === "function") cb = nofollow, nofollow = false;
  if (typeof etag === "function") cb = etag, etag = null;

  new File(filename, function (er, f) {
    if (er) return log.er(cb, "Couldn't open "+filename)(er);
    PUT(url, where, f, etag, nofollow, function (er) {
      log.info("done with upload", "upload");
      cb(er);
    });
  });
}

function uploadFile(url, filepath, fields, contentType, cb){
  var boundary = Math.random();
  var post_data = [];
  var path = require('path');
  var filename = path.basename(filepath);
  for(var key in fields){
    post_data.push(new Buffer(EncodeFieldPart(boundary, key, fields[key]), 'ascii'));
  }
  
  post_data.push(new Buffer(EncodeFilePart(boundary, contentType, 'file', filename), 'ascii'));

  var file_reader = fs.createReadStream(filepath, {encoding: 'binary'});
  var file_contents = '';
  file_reader.on('data', function(data){
    file_contents += data;
  });
  file_reader.on('end', function(){
    post_data.push(new Buffer(file_contents, 'binary'));
    post_data.push(new Buffer("\r\n--" + boundary + "--"), 'ascii');
    doUploadFile(url, post_data, boundary, cb);
  });
}

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
function doUploadFile(urlpath, post_data, boundary, cb) {

  var length = 0;

  for(var i = 0; i < post_data.length; i++) {
    length += post_data[i].length;
  }
  var url = require('url');
  var https = https || require('https');
  var post_options = {
    host: url.parse(getFeedHenryUrl()).hostname,
    port: '443',
    path: urlpath,
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
      return cb(undefined, data); 
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


function File (name, cb) {
  var f = this;
  f.name = name;
  if (f.loaded) return cb(undefined, f);
  log.info(f.name, "stat");
  fs.stat(f.name, function (er, stat) {
    if (er) return log.er(cb, "doesn't exist "+f.name)(er);
    log.silly(stat, "stat "+name);
    f.length = stat.size;
    fs.open(f.name, "r", 0666, function (er, fd) {
      if (er) return log.er(cb, "Error opening "+f.name)(er);
      f.fd = fd;
      cb(undefined, f);
    });
  });
};

function getFeedHenryUrl () {
  var r = fhc.config.get("feedhenry");
  log.verbose(r, "feedhenry url");
  if (!r) {
    return new Error("Must define feedhenry URL before accessing FeedHenry.");
  }
  if (r.substr(-1) !== "/") r += "/";
  fhc.config.set("feedhenry", r);
  return r;
};

function getMessagingUrl () {
  var r = fhc.config.get("messaging");
  if (!r) {
    return new Error("Must define messaging URL before accessing FeedHenry Message Server.");
  }
  if (r.substr(-1) !== "/") r += "/";
  fhc.config.set("messaging", r);    
  return r;
}
