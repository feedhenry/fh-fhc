/* globals i18n */
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
request.importUpload = importUpload;
request.requestFunc = doRequest;
request.createErrorMessage = createErrorMessage;

var fhc = require("../fhc");
var requestjs = require('request');
var url = require("url");
var util = require('util');
var log = require("./log");
var fs = require("fs");
var os = require("os");
var keys = require("../cmd/common/keys/user.js");
var urlUtils = require('url');
var once = require("once");
var _ = require('underscore');
var async = require('async');


/**
 * Function To Generate A Relevant Error Message
 * @param err          - Error from requestJS
 * @param httpResponse - HTTP Response
 * @param body - Error Response Body
 */
function createErrorMessage(err, httpResponse, body){
  var requestId = httpResponse ?  httpResponse.headers['X-FH-REQUEST-ID'] || httpResponse.headers['x-fh-request-id'] : null;
  var statusCode = httpResponse ? httpResponse.statusCode : null;

  if(err && requestId) {
    err.requestId = requestId;
    return err;
  } else {
    var msg = util.format(i18n._('Error - not 2xx status code. (%s)\n'), statusCode);

    //If the body is a string, try to parse it as an object.
    if(_.isString(body)){
      try {
        body = JSON.parse(body);
      } catch(e){
        body = null;
      }
    }

    if(body && body.userDetail){
      msg +=  body.code + " - " + body.userDetail + "\n";
      msg += body.systemDetail;
    } else {
      msg += JSON.stringify(body);
    }

    var error = new Error(msg);

    error.requestId = requestId;
  }

  return error;
}

function request(){}

function doRequest (fhurl, method, where, what, etag, nofollow, cb_) {
  log.silly(where||"/", method);

  if (where.match(/^\/?favicon.ico/)) {
    return cb_(new Error(i18n._("favicon.ico isn't a package, it's a picture.")));
  }
  if (typeof cb_ !== "function") {
    cb_ = nofollow;
    nofollow = false;
  }
  if (typeof cb_ !== "function") {
    cb_ = etag;
    etag = null;
  }
  if (typeof cb_ !== "function") {
    cb_ = what;
    what = null;
  }

  if (fhurl instanceof Error) {
    return cb_(fhurl);
  }
  log.silly(fhurl, "url, unparsed");


  // Since there are multiple places where an error could occur,
  // don't let the cb be called more than once.
  var errState = null;
  var __stats__ = {
    "url": where
  };
  function cb (er) {
    if (errState) {
      return;
    }
    if (er) {
      errState = er;
    }
    if (fhc.config.get("statsMode") && null !== arguments[1]) {
      arguments[1].__stats__ = __stats__;
    }
    cb_.apply(undefined, arguments);
  }

  where = resolveUrl(where, fhurl);

  var remote = url.parse(where)
    , secure = remote.protocol === "https:"
    , port = remote.port || (secure ? 443 : 80)
    , hostname = remote.hostname;

  log.verbose(remote.href + " payload: " + util.inspect(what), "calling url");
  if (port !== (secure ? 443 : 80)) {
    hostname += ":" + port;
  }
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

  if (!remote.protocol) {
    log.warn(remote, "No protocol found");
  }

  log.silly(headers, "headers");

  var opts = { uri : where
    , method: method
    , body: what
    , headers: headers
    , proxy: getProxy()
    , followRedirect : !nofollow
  };

  var startTime = Date.now();
  requestjs(opts, function (error, response, body) {
    var data = body;

    if( error ) {
      log.er(cb, "response error from " + where);
      return cb(error);
    }

    if (response.statusCode.toString()[0]!=='2'){
      return cb(createErrorMessage(error, response, body));
    }

    __stats__.duration = Date.now() - startTime;
    __stats__.status = response.statusCode;
    __stats__.body = data;

    var parsed;
    if (response.statusCode !== 304) {
      log.silly(response.headers, "response headers");
      var contentType = response.headers ? response.headers['content-type'] : '';
      if (contentType && (contentType.indexOf('application/json') !== -1
        || contentType.indexOf('text/json') !== -1
        || contentType.indexOf('text/plain') !== -1)) {
        try {
          parsed = JSON.parse(data);
        } catch (ex) {
          ex.message += "\n" + data;
          log.verbose(data, "bad json");
          log.error(i18n._("error parsing json"), "FeedHenry");
          return cb(ex, null, data, response);
        }
      }else {
        parsed = data;
      }
    }

    var er;
    if (parsed && parsed.error) {
      var w = url.parse(where).pathname.substr(1)
        , name = w.split("/")[0];
      if (parsed.error === "not_found") {
        er = new Error("404 Not Found: "+name);
      } else {
        er = parsed.error + " " + (parsed.reason || "");
      }

    }

    if(er) {
      er = createErrorMessage(er, response, body);
    }

    return cb(er, parsed, data, response);
  });

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

function DELETE (url, where, what, etag, nofollow, cb) {
  request.requestFunc(url, "DELETE", where, what, etag, nofollow, cb);
}

function MULTIGET (fhurls, where, cb) {
  var urls = fhurls.split(',');
  var ret = {};

  function doGetUrl(url, callback) {
    request.requestFunc(url, "GET", where, null, null, function(er, parsed, data) {
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
 * Creates a closure over a callback that handles error and status code checking for a upload request
 * @param  {Function} cb Callback function
 * @return {Function}      Node-style callback closed over `cb`
 * @access private
 */
function uploadHandlerFor(cb) {
  return function(err, response, body) {
    if(err) {
      return cb(i18n._("Error Uploading File") + " " + err);
    }

    if (response.statusCode.toString()[0]!=='2') {
      return cb(createErrorMessage(null, response, body));
    }

    return cb();
  };
}

/**
 * Utility function to download files to a file path from a url
 * @param params
 * @param cb
 */
function downloadFile(params, cb){
  // if there's an error the callback will have been called with the err,
  // ensure that we don't also call it without the error when the writestream finishes
  var cbOnce = once(cb);
  var url = params.url;
  var filePath = params.output;
  var fileStream = fs.createWriteStream(filePath);

  var fullUrl = urlUtils.resolve(getFeedHenryUrl(), url);

  var opts = {
    url : fullUrl,
    method: params.method || "GET"
    , headers : getHeaders()
    , proxy : getProxy()
  };
  var req = requestjs(opts);

  req.on('error', function(err){
    fs.unlink(filePath, function(){
      return cbOnce(err);
    });
  });

  fileStream.on('finish', function(){
    console.log(util.format(i18n._('Saved to %s'), filePath));
    return cbOnce();
  });

  req.on('response', function(response){
    var statusCode = response.statusCode;
    if(statusCode >= 400){
      req.emit('error', new Error("Request failed with status code " + statusCode));
    }
  }).pipe(fileStream);
}

/**
 * Upload function for the import commands
 * @param  {String}   path Path to the local zip file for upload
 * @param  {String}   url  Relative target url, received as param for DRYing up usage
 * @param  {Function} cb   fh3 command callback
 */
function importUpload(path, url, cb) {
  var stream = fs.createReadStream(path);
  var fullUrl = urlUtils.resolve(getFeedHenryUrl(), url);

  var opts = {
    url: fullUrl,
    proxy : getProxy(),
    headers: getHeaders()
  };
  var req = requestjs.post(opts, uploadHandlerFor(cb));
  var form = req.form();
  form.append('file', stream);
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
    proxy : getProxy(),
    json: true,
    formData: {
      attachments: fileStream
    }
  };

  requestjs(opts, uploadHandlerFor(cb));
}


function uploadFile(url, filepath, fields, contentType, cb){
  var boundary = Math.random();
  var postData = [];
  var path = require('path');
  var filename = path.basename(filepath);
  _.each(fields, function (field, key) {
    postData.push(new Buffer(EncodeFieldPart(boundary, key, field), 'ascii'));
  });

  postData.push(new Buffer(EncodeFilePart(boundary, contentType, 'file', filename), 'ascii'));

  var fileReader = fs.createReadStream(filepath, {encoding: 'binary'});
  var fileContents = '';
  fileReader.on('data', function(data){
    fileContents += data;
  });
  fileReader.on('end', function(){
    postData.push(new Buffer(fileContents, 'binary'));
    postData.push(new Buffer("\r\n--" + boundary + "--"), 'ascii');
    doUploadFile(url, postData, boundary, cb);
  });
}

// Field encoding
function EncodeFieldPart(boundary,name,value) {
  var returnPart = "--" + boundary + "\r\n";
  returnPart += "Content-Disposition: form-data; name=\"" + name + "\"\r\n\r\n";
  returnPart += value + "\r\n";
  return returnPart;
}

// File encoding
function EncodeFilePart(boundary,type,name,filename) {
  var returnPart = "--" + boundary + "\r\n";
  returnPart += "Content-Disposition: form-data; name=\"" + name + "\"; filename=\"" + filename + "\"\r\n";
  returnPart += "Content-Type: " + type + "\r\n\r\n";
  return returnPart;
}

// do the actual upload
function doUploadFile(urlpath, postData, boundary, cb) {
  var platform = '<node 0.4>';
  var release = '<node 0.4>';
  try{
    platform = os.platform();
    release = os.release();
  } catch (x) {
    // ignored, this will fail on node 0.4.x
    }

  var length = _.reduce(postData, function (sum, post) {
    return sum + post.length;
  }, 0);
  var url = require('url');
  var https = https || require('https');
  var postOptions = {
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

  var postRequest = https.request(postOptions, function(response){
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

  _.each(postData, function (post) {
    postRequest.write(post);
  });
  postRequest.end();
}

function getFeedHenryUrl () {
  var r = fhc.config.get("feedhenry");
  log.verbose(r, "feedhenry url");
  if (!r) {
    return new Error(i18n._("Must target a feedhenry domain first."));
  }
  if (r.substr(-1) !== "/") r += "/";
  fhc.config.set("feedhenry", r);
  return r;
}

function getMessagingUrl () {
  var r = fhc.config.get("messaging");
  if (!r) {
    return new Error(i18n._("Must define messaging URL before accessing FeedHenry Message Server."));
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
  if (cookie) {
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
  if(apiKey){
    headers['X-FH-AUTH-USER'] = apiKey;
  }

  log.verbose(headers, "getHeaders");
  return headers;
}

function getProxy() {
  var proxy = fhc.config.get("proxy");
  log.silly(proxy, "getProxy");
  return proxy;
}
