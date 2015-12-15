module.exports = request;
request.GET = GET;
request.MULTIGET = MULTIGET;
request.PUT = PUT;
request.POST = POST;
request.DELETE = DELETE;
request.uploadFile = uploadFile;
request.downloadFile = downloadFile;
request.streamFileUpload = streamFileUpload;
request.getFeedHenryUrl = getFeedHenryUrl;
request.getMessagingUrl = getMessagingUrl;
request.requestFunc = doRequest;

var fhc = require("../fhc");
var requestjs = require("request");
var url = require("url");
var util = require('util');
var log = require("./log");
var ini = require("./ini");
var fs = require("fs");
var os = require("os");
var keys = require("../cmd/common/keys/user.js");
var urlUtils = require('url');
var once = require("once");

function request(){};

function doRequest (fhurl, method, where, what, etag, nofollow, cb_) {
  log.silly(where||"/", method);

  if (where.match(/^\/?favicon.ico/)) {
    return cb_(new Error("favicon.ico isn't a package, it's a picture."));
  }
  if (typeof cb_ !== "function") cb_ = nofollow, nofollow = false;
  if (typeof cb_ !== "function") cb_ = etag, etag = null;
  if (typeof cb_ !== "function") cb_ = what, what = null;

  if (fhurl instanceof Error) return cb_(fhurl);
  log.silly(fhurl, "url, unparsed");


  // Since there are multiple places where an error could occur,
  // don't let the cb be called more than once.
  var errState = null;
  var __stats__ = {
    "url": where
  };
  function cb (er) {
    if (errState) return;
    if (er) errState = er;
    if (fhc.config.get("statsMode") && null != arguments[1]) {
      arguments[1].__stats__ = __stats__;
    }
    cb_.apply(undefined, arguments);
  }

  where = resolveUrl(where, fhurl);

  var remote = url.parse(where)
    , secure = remote.protocol === "https:"
    , port = remote.port || (secure ? 443 : 80)
    , hostname = remote.hostname;
  //  , auth = authRequired && fhc.config.get("_auth")

  log.verbose(remote.href + " payload: " + util.inspect(what), "calling url");
  if (port !== (secure ? 443 : 80)) hostname += ":" + port;
  log.silly(port, "port");

  var headers = getHeaders();

  if (what) {
    log.verbose(what, "what...");
    delete what._etag;
    log.silly(what,"writing json");
    if (typeof(what) === 'string') {
      what = new Buffer(what);
    }else {
      what = new Buffer(JSON.stringify(what));
    }
    headers["content-type"] = "application/json";
    headers["content-length"] = what.length;
  } else {
    headers["content-length"] = 0;
  }
  if (etag) {
    log.silly(etag, "etag");
    headers[method === "GET" ? "if-none-match" : "if-match"] = etag;
  }

  if (!remote.protocol) log.warn(remote, "No protocol?");

  log.silly(headers, "headers");
  //if (what) log.verbose(what.toString(), "body");

  var opts = { uri : where
    , method: method
    , body: what
    , headers: headers
    , proxy: getProxy(remote)
    , followRedirect : !nofollow
  };

  var startTime = Date.now();
  requestjs(opts, function (error, response, body) {
    var data = body;

    if( error ) {
      log.er(cb, "response error from "+where);
      return cb(error);
    }

    if (response.statusCode.toString()[0]!=='2'){
      return cb("Error - non 2xx status code: " + body);
    }

    __stats__.duration = Date.now() - startTime;
    __stats__.status = response.statusCode;
    __stats__.body = data;

    var parsed;
    if (response.statusCode !== 304) {
      //console.log("HEADERS: " + util.inspect(response.headers['content-type']));
      //console.log("DATA: " + data);
      log.silly(response.headers, "response headers");
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
        er = parsed.error + " " + (parsed.reason || "");
      }

    }
    return cb(er, parsed, data, response);
  })

};

function GET (url, where, etag, nofollow, cb) {
  request.requestFunc(url, "GET", where, null, etag, nofollow, cb);
};

function PUT (url, where, what, etag, nofollow, cb) {
  request.requestFunc(url, "PUT", where, what, etag, nofollow, cb);
};

function POST (url, where, what, etag, nofollow, cb) {
  request.requestFunc(url, "POST", where, what, etag, nofollow, cb);
};

function DELETE (url, where, what, etag, nofollow, cb) {
  request.requestFunc(url, "DELETE", where, what, etag, nofollow, cb);
};

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

/**
 * Utility function to download files to a file path from a url
 * @param params
 * @param cb
 */
function downloadFile(params, cb){
  var cbOnce = once(cb);    // if there's an error the callback will have been called with the err, ensure that we don't also call it without the error when the writestream finishes
  var url = params.url;
  var filePath = params.output;
  var fileStream = fs.createWriteStream(filePath);

  var fullUrl = urlUtils.resolve(getFeedHenryUrl(), url);

  var opts = {
    url : fullUrl,
    method: params.method || "GET"
    , headers : getHeaders()
    , proxy : getProxy(fullUrl)
  };
  var req = requestjs(opts);

  req.on('error', function(err){
    fs.unlink(filePath, function(){
      return cbOnce(err);
    });
  });

  fileStream.on('finish', function(){
    console.log('Saved to ' + filePath);
    return cbOnce();
  });

  req.on('response', function(response){
    var statusCode = response.statusCode;
    if(statusCode >= 400){
      req.emit('error', new Error("Request failed with status code " + statusCode));
    }
  }).pipe(fileStream)
}

/**
 * Streaming Files To The Target
 * @param params
 * @param cb
 */
function streamFileUpload(params, cb){
  var url = params.url;
  var filePath = params.file;
  var fileStream = fs.createReadStream(filePath);
  var fullUrl = urlUtils.resolve(getFeedHenryUrl(), url);

  var opts = {
    url : fullUrl,
    headers : getHeaders(),
    method: params.method || 'post',
    proxy : getProxy(fullUrl),
    json: true,
    formData: {
      attachments: fileStream
    }
  };

  requestjs(opts, function(err, response){
    if(err){
      return cb("Error Uploading File " + err);
    }

    if (response.statusCode.toString()[0]!=='2'){
      return cb("Error - non 2xx status code: " + response.statusCode + " " + response.body);
    }

    return cb();
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
	var platform = '<node 0.4>';
	var release = '<node 0.4>';
	try{
		platform = os.platform();
		release = os.release();
	} catch (x) {
		// ignored, this will fail on node 0.4.x
	}

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
      'Cookie' : "feedhenry=" + fhc.config.get("cookie") + ";",
	    'User-Agent' : "FHC/" + fhc._version + ' ' + platform + '/' + release
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


// NOTE: the request upload doesn't work on all FH clusters
function REQUEST_uploadFile(fhurl, filepath, fields, contentType, cb){
  var boundary = Math.random();
  var post_data = [];
  var path = require('path');
  var filename = path.basename(filepath);

  var fullUrl = resolveUrl(fhurl);
  var remote = url.parse(fullUrl);
  var headers = getHeaders();

  var opts = {
    url : fullUrl
    , headers : headers
    , proxy : getProxy(remote)
  };

  log.verbose(opts, "uploadFile - opts");

  var r = requestjs.post(opts);

  // Get a handle on a form for Multi Part Form Upload
  var form = r.form();

  // Add all passed fields to the form
  for(var key in fields){

    // Dirty hack to get around the limitations of CombinedStream.isStreamLike()...
    // i.e. uit thinks booleans are streams!
    var value = fields[key] + "";
    log.verbose('Adding form field ' + key + " with value " + value);
    form.append(key, value);
  }

  // Add the file to the form
  form.append('file', fs.createReadStream(filepath));

  // Get the content length of the form once it is finished adding all fields.

  form.getLength(function(err, length) {
    if(err) cb(err);

    log.verbose(length, "form.getLength()");

    headers["content-length"] = length;

    // Set the headers on the request object
    r.setHeaders(headers);
  });

  r.on("error", function (er) {
    log.er(er);
    cb(er);
  })

  r.on('response', function(response){

    log.silly('received response');
    response.setEncoding('utf8');

    var data = '';
    response.on('data', function(chunk){
      data = data + chunk;
    });

    response.on('end', function(){
      log.silly(data, "DATA");
      data = JSON.parse(data);
      return cb(undefined, data);
    });

    response.on('error', function(err) {
      return cb(err);
    });
  });

  return r;
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
    return new Error("Must target a feedhenry domain first.");
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

function resolveUrl(where, fhurl) {
  log.verbose(where, "resolveUrl - IN");
  if (!where.match(/^https?:\/\//)) {
    if (where.charAt(0) !== "/") where = "/" + where;
    fhurl = fhurl || getFeedHenryUrl();
    where = url.resolve(fhurl, where);
  }

  log.verbose(where, "resolveUrl - OUT");

  return where;
}

function getHeaders() {
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
  try {
    var explainLvl = parseInt(fhc.config.get('explain'), 10);
    log.silly(explainLvl, "explain level");
    if (explainLvl > 0) {
      headers['X-FeedHenry-Explain'] = 'active' + ((explainLvl > 1) ? ' stacktrace' : '');
    }
  } catch (e) {
    log.error('explain config value should be a Number: ' + e);
  }
  var platform = '<node 0.4>';
  var release = '<node 0.4>';
  try{
    platform = os.platform();
    release = os.release();
  } catch (x) {
    // ignored, this will fail on node 0.4.x
  }
  headers['User-Agent'] = "FHC/" + fhc._version + ' ' + platform + '/' + release;

  var apiKey = keys.getUserApiKey();
  if(null != apiKey && (typeof apiKey !== "undefined")){
    headers['X-FH-AUTH-USER'] = apiKey;
  }

  log.verbose(headers, "getHeaders");
  return headers;
}

function getProxy(url) {
  var proxy = fhc.config.get("proxy");
  log.silly(proxy, "getProxy");
  return proxy;
}
