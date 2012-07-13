"use strict";

module.exports = local;
local.usage = ["",
        "fhc local proxy=<true|false> app=<appId> domain=<domain> port=<port> packages=<package[,package...]> watch=<true|false>",
        "Run from app root. All params are optional",
        "",
        "'domain' is the domain where your the app is hosted (For example: 'http://apps.feedhenry.com' - domain=apps)",
        "'proxy' specifies whether act calls should be handled locally or proxied to the feedhenry cloud, defaults to false",
        "'port' is not required, the default port is 8888",
        "'packages' is not required, packages are used to tell the server where to look for files. Multiple packages can be specified, seperated by a ','",
        "'watch' only applies if proxy=false, if true, any changes to the cloud code will be reloaded automatically without having to restart the server. watch defaults to true",
        ""].join("\n");


var http = require("http"),
  https = require("https"),
  url = require("url"),
  path = require("path"),
  fs = require("fs"),
  util = require("util"),
  events = require("events"),
  common = require("./common"),
  log = require("./utils/log"),
  fhc = require("./fhc"),
  hosts = require("./hosts"),
  mimeTypes = {
    json: "application/json",
    js: "text/javascript",
    css: "text/css",
    html: "text/html",
    xml: "text/xml",
    txt: "text/plain",
    woff: "font/opentype"
  },
  defaultArgs = {
    baseDomain: { required: true,
      val: "feedhenry.com",
      type: "string"
    },
    port: {
      required: true,
      val: 8888,
      type: "number"
    },
    domain: {
      required: true,
      val: "apps",
      type: "string"
    },
    app: {
      required: true,
      val: "localguidplaceholder",
      type: "guid"
    },
    packages: {
      required: false,
      type: "array"
    },
    index: {
      required: true,
      val: "index.html",
      type: "string"
    },
    proxy: {
      required: true,
      val: "false",
      type: "boolean"
    },
    watch: {
      required: true,
      val: "true",
      type: "boolean"
    }
  };

fs.exists = fs.exists || path.exists;
fs.existsSync = fs.existsSync || path.existsSync;

function tryParse(data, defaultVal) {
  var res;
  try {
    res = JSON.parse(data);
  }
  catch(e) {
    res = defaultVal;
  }
  return res;
}

function validateArgs(args) {
  for(var i in defaultArgs) {
    var defaultArg = defaultArgs[i],
      currentArg = args[i];
    if(args[i] === undefined) {

      if(defaultArg.required) {
        if(!defaultArg.val) {
          throw new Error("Missing '" + i + "' parameter");
        }
        else if(defaultArg.val) {
          currentArg = args[i] = defaultArg.val;
        }
      }
    }
    if(currentArg !== undefined) {
      switch(defaultArg.type) {
        case "boolean":
          args[i] = typeof currentArg === "boolean" ? currentArg : currentArg === "true" ? true : false;
          break;
        case "array": 
          args[i] = currentArg.split(defaultArg.delim || ",");
          break;
        case "guid":
          args[i] = fhc.appId(currentArg);
          break;
        case "number":
          args[i] = parseInt(currentArg, 10);
          break;
      }
    }
  }
}


function local(args, cb) {
  var argObj;
  try {
    argObj = common.parseArgs(args);
    validateArgs(argObj);
  } catch (x) {
    return cb("Error processing args: " + x + "\nUsage: " + local.usage);
  }

  var staticHandler = new StaticHandler(argObj),
    actHandler = argObj.proxy ? new RemoteActHandler(argObj) : new LocalActHandler(argObj);


  var server = http.createServer(function(request, response) {
    if(actHandler.canHandle(request)) {
      actHandler.handleRequest(request, response);
    }
    else if(staticHandler.canHandle(request)) {
      staticHandler.handleRequest(request, response);
    }
    else response.end();
  });
  server.on("error", cb);
  staticHandler.on("error", cb);
  actHandler.on("error", cb);

  try {
    server.listen(argObj.port);
  }
  catch(e) {
    return cb(e);
  }
  console.log("server listening on port:", argObj.port);
  console.log("go to http://127.0.0.1:" + argObj.port + "/ in your browser");
}

function RequestHandler(options) {
  options = options || {};
  this.subDomain = options.domain || "apps";
  this.baseDomain = options.baseDomain || "feedhenry.com";
  this.target = this.subDomain + "." + options.baseDomain;
  this.guid = options.app || options.guid || "";
}
util.inherits(RequestHandler, events.EventEmitter);
RequestHandler.prototype.handleError = function(e, res) {
  this.emit("error", e);
};
RequestHandler.prototype.handleRequest = function(request, response) {};

// this might need a callback, however for now, it's unlikely that any changes
// will be made in the milliseconds that it takes to do this...provided that you
//haven't got a *huge* set of dependencies
RequestHandler.prototype.listenTo = function(directory, recursive) {
  var self = this;
  var timeout;

  if(!fs.statSync(directory).isDirectory()) {
    this.handleError(new Error("\"" + directory + "\" is not a directory" ));
  }

  if(recursive) {
    fs.readdir(directory, function(err, files) {

      for(var i = 0, il = files.length; i < il; i++) {
        var file = path.join(directory, files[i]);

        if(fs.statSync(file).isDirectory()) {
          self.listenTo(file, true);
        }
      }

    });
  }

  fs.watch(directory, function(e, filename) {
    clearTimeout(timeout);
    timeout = setTimeout(function() {
      self.handleFileSystemChange(e, filename);
    }, 10);
  });
};
RequestHandler.prototype.handleFileSystemChange = function() {};


function ActHandler(options) {
  options = options || {};
  RequestHandler.call(this, options);
}
util.inherits(ActHandler, RequestHandler);

ActHandler.prototype.canHandle = function(request) {
  return request.method === "POST";
};

// remote act handler
// proxies act requests to the feedhenry cloud and
// writes the response back to the client
function RemoteActHandler(options) {
  options = options || {};
  ActHandler.call(this, options);

  var self = this,
    env = this.env = options.env === "dev" ? "development" : options.env !== undefined ? options.env : "millicore";

  // set up access to proper node endpoint, without proxy through millicore
  switch (options.env) {
    case "dev":
    case "live":
      hosts([this.guid], function(err, res) {
        if(err) {
          //leave defaults
          return;
        }
        self.target = url.parse(res.hosts[env + "-url"]).hostname;
      });
      break;
  }
}
util.inherits(RemoteActHandler, ActHandler);


// unwanted headers that mess up responses from millicore
var UNWANTED_HEADERS = [
  "host",
  "origin",
  "accept-encoding"
];

RemoteActHandler.prototype.requireHeaders = function(requestHeaders) {
  for(var i = 0, il = UNWANTED_HEADERS.length; i < il; i++) {
    delete requestHeaders[UNWANTED_HEADERS[i]];
  }
  return requestHeaders;
};

RemoteActHandler.prototype.handleRequest = function(request, response) {
  var requestParams = url.parse(request.url, true),
    uri = requestParams.pathname,
    uriComponents = uri.split("/"),
    act = uriComponents[uriComponents.length - 2],
    params = "";

  log.silly("Proxying act request");
  log.silly(uri, "url");
  log.silly(act, "act");

  var opts = {
    path: this.env === "millicore" ? uri : "/cloud/" + act,
    method: request.method,
    host: this.target,
    headers: this.requireHeaders(request.headers)
  };

  log.silly(opts, "request options");

  var proxyReq = https.request(opts, function(proxyRes) {
    response.writeHead(proxyRes.statusCode, proxyRes.headers);

    proxyRes.on("data", function(chunk) {
      response.write(chunk.toString());
    });
    proxyRes.on("end", function() {
      response.end();
    });
  });

  request.on("data", function(chunk) {
    params += chunk.toString();
    proxyReq.write(chunk.toString());
  });

  request.on("end", function() {
    var parsedParams;
    try {
      parsedParams = JSON.parse(params);
      log.silly(parsedParams,"params");
    }
    catch(e) {
      log.silly(params,"params");
    }
    proxyReq.end();
  });

};

// local act handler
// handles act request locally
function LocalActHandler(options) {
  options = options || {};
  ActHandler.call(this, options);

  this.cloud = options.cloud || "./cloud/";
  this.main = options.main || "main.js";
  this.watch = options.watch !== undefined ? options.watch : true;
  this.env = null;
  this.legacy = false;
  this.init();

  if(this.watch) {
    this.listenTo(this.cloud, true);
  }
}
util.inherits(LocalActHandler, ActHandler);

LocalActHandler.prototype.handleFileSystemChange = function(e, filename) {
  this.init();
};

LocalActHandler.prototype.init = function() {
  var env;

  console.log("loading cloud code...");

  try {
    var cloudPath = require.resolve(path.join(process.cwd(), this.cloud, this.main));
    //clear the required cloud code from the cache
    //as we won't be requiring anything again here for the local server,
    //it's safe enough to just nuke the cache
    //Module holds an internal reference to the cache which is modified,
    //so we have to loop through all the items in the cache and delete them one by one...
    var cache = require.cache;
    for(var i in cache) if(cache.hasOwnProperty(i)) {
      delete cache[i];
    }
    env = require(cloudPath);

    if(!Object.keys(env).length) {
      this.handleError(new Error("Looks like you didn't export any functions. Is this a rhino app?"));
    }
    if(env) {
      this.env = env;
      console.log("cloud code loaded...");
    }
  }
  catch(e) {
    if(this.env) {
      //we have an environment loaded but we got an error trying to reload
      log.error("Failed to reload environment, using current version");
      log.error(e);
    }
    else {
      log.error(e);
      this.handleError(new Error("Cannot load cloud code"));
    }
  }
};

LocalActHandler.prototype.handleRequest = function(request, response) {
  var self = this,
    uri = request.url,
    uriComponents = uri.split("/"),
    paramString = "",
    act = uriComponents[uriComponents.length - 2];

  log.silly("Handling act request locally");
  log.silly(uri, "url");
  log.silly(act, "act");

  request.on("data", function(chunk) {
    paramString += chunk.toString();
  });

  request.on("end", function() {
    var params = tryParse(paramString, null),
      env = self.env;

    log.silly(params, "params");

    if(env.hasOwnProperty(act)) {
      return env[act](params, function(err, data, headers) {
        if(err) {
          return self.handleScriptError(err, act, response);
        }

        headers = headers || {};
        headers["content-type"] = headers["content-type"] || mimeTypes.json;

        response.writeHead(200, headers);
        response.end(typeof data !== "string" ? JSON.stringify(data) : data);
      });
    }
    else {
      return self.handle404Error(act, response);
    }
  });
};

LocalActHandler.prototype.handleScriptError = function(err, act, response) {
  response.writeHead(500);
  var error = {
    msg: "Internal error in " + act + ": " + err.message,
    error: JSON.stringify(err)
  };
  response.end(JSON.stringify(error));
};

LocalActHandler.prototype.handle404Error = function(act, response) {
  response.writeHead(404);
  response.end(JSON.stringify({
    error:"Error: no such function: " + act
  }));
};

// static file handler
// handles searching through package directories and
// writing files
function StaticHandler(options) {
  RequestHandler.call(this, options);

  this.index = options.main || "index.html";
  this.initParams = JSON.stringify({
    appMode: "debug",
    checkDeliveryScheme:true,
    debugCloudType:"fh",
    destination:{
      inline:false,
      name:"studio"
    },
    domain: this.subDomain,
    releaseCloudType:"fh",
    releaseCloudUrl:"https://",
    user: { id:"123456789", role: "sub" },
    widget: {
      guid: this.guid,
      inline:false,
      instance: this.guid,
      version:333
    }
  });
  this.packages = (options.packages || []).concat("default", "../shared");
}
util.inherits(StaticHandler, RequestHandler);

StaticHandler.prototype.canHandle = function(request) {
  return request.method === "GET";
};

StaticHandler.prototype.handleRequest = function(request, response) {
  var self = this,
    requestParams = url.parse(request.url, true),
    uri = requestParams.pathname;

  this.getPackageFile(uri, function(exists, filename) {
    if(!exists) {
      response.writeHead(404);
      return response.end("Not found\n");
    }
    fs.readFile(filename, "binary", function(err, file) {
      if(err) {
        response.writeHead(500);
        return response.end(err + "\n");
      }

      response.writeHead(200, {
        "content-type": mimeTypes[filename.split(".").pop()] || mimeTypes.txt
      });

      if(filename.indexOf(self.index) >= 0) {
        response.end(self.buildIndex(file, requestParams.query));
      }
      else {
        response.end(file, "binary");
      }
    });
  });
};

StaticHandler.prototype.getPackageFile = function(uri, cb) {
  var lookupIndex = 0,
    packages = this.packages,
    self = this;

  (function checkNextPath() {
    var filename = path.join(process.cwd(), "client", packages[lookupIndex++], uri);

    fs.exists(filename, function(exists) {
      if(!exists) {//try the next one
        if(lookupIndex >= packages.length) {
          cb(false);
        }
        else {
          checkNextPath();
        }
      }
      else if (fs.statSync(filename).isDirectory()) {
        //special case for directories
        //check is index.html available
        uri += '/' + self.index;
        lookupIndex--;
        checkNextPath();
      }
      else {
        cb(true, filename);
      }
    });
  })();

};

StaticHandler.prototype.buildIndex = function(file, requestQuery) {
  var html = new Element("html"),
    head = new Element("head"),
    body = new Element("body"),
    initScript = new Element("script"),
    apiScript = new Element("script"),
    contentType = new Element("meta");

  contentType.setAttribute("http-equiv", "Content-Type" );
  contentType.setAttribute("content", "text/html; charset=utf-8");

  if(requestQuery.device !== undefined && requestQuery.version !== undefined) {
    var viewport = new Element("meta");
    viewport.setAttribute("name", "viewport");
    viewport.setAttribute("content", "width=device-width, height=device-height, user-scalable=no");
    apiScript.setAttribute("src", "http://" +
      this.target + "/static/mac/script/" +
      requestQuery.device + "_" +
      requestQuery.version + "/167-scripts.js");

    head.append(viewport);
  }
  else {
    apiScript.setAttribute("src", "https://" + this.target + "/static/pec/script/studio/155-scripts.js");
  }

  initScript.append("$fhclient = $fh.init(" + this.initParams + ");");

  body.setAttribute("style", "margin:0px;padding:0px;");

  head.append(contentType, apiScript, initScript);
  body.append(file);
  html.append(head, body);

  return "<!doctype html>" + html.toString();
};

//used for creating html files
function Element(tag) {
  this.tag = tag;
  this.children = [];
  this.attributes = {};
}
Element.prototype = {
  append: function() {
    Array.prototype.push.apply(this.children, arguments);
  },
  setAttribute: function(key, value) {
    this.attributes[key] = value;
  },
  toString: function() {
    var attributes = this.attributes,
      children = this.children,
      tag = this.tag,
      string = "<" + tag;

    for(var key in attributes) {
      string += " " + key + "=\"" + attributes[key] + "\"";
    }
    return string + ">" + children.join("") + "</" + tag + ">";
  }
};