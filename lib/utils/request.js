module.exports = request;
request.GET = GET;
request.MULTIGET = MULTIGET;
request.PUT = PUT;
request.POST = POST;
request.uploadFile = uploadFile;
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
var keys = require("../keys");

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
      cb();
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
  })

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


function uploadFile(fhurl, filepath, fields, contentType, cb){
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
  headers['User-Agent'] = "FHC/" + fhc.version + ' ' + platform + '/' + release;

  var apiKey = keys.getUserApiKey();
  if(null != apiKey && (typeof apiKey !== "undefined")){
    headers['X-FH-AUTH-USER'] = apiKey;
  }

  log.verbose(headers, "getHeaders");
  return headers;
}

function getProxy(url) {
  var proxy
  if (url.protocol !== "https:" || !(proxy = fhc.config.get("https-proxy"))) {
    proxy = fhc.config.get("proxy")
  }
  log.silly(proxy, "getProxy");
  return proxy;
}