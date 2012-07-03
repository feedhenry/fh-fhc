module.exports = local;
local.usage = ["",
        "fhc local app=<appId> domain=<domain> port=<port> package=<package>",
        "where domain is the domain where your the app is hosted (For example: 'http://apps.feedhenry.com' - domain=apps)",
        "'port' is not required, the default port is 8888",
        "'packages' is not required, packages are used to tell the server where to look for files. Multiple packages can be specified, seperated by a ','",
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
  mimeTypes = {
    js: "text/javascript",
    css: "text/css",
    html: "text/html",
    xml: "text/xml",
    txt: "text/plain"
  },
  defaultArgs = {
    baseDomain: {
      required: true,
      val: "feedhenry.com"
    },
    port: {
      required: true,
      val: 8888
    },
    domain: {
      required: true
    },
    app: {
      required: true
    },
    weinre: {
      required: false
    },
    packages: {
      required: false
    },
    main: {
      required: true,
      val: "index.html"
    },
    proxy: {
      required: true,
      val: "true"
    }
  },
  initParams = {
    appMode:"debug",
    checkDeliveryScheme:true,
    debugCloudType:"fh",
    debugCloudUrl:"https://",
    deliveryScheme:"https://",
    destination:{
      inline:false,
      name:"studio"
    },
    domain:"",
    host:"",
    nameserver:"https://ainm.feedhenry.com",
    releaseCloudType:"fh",
    releaseCloudUrl:"https://",
    swagger_view:"Sju8tJFwM7kox_S1rr1wZ2PS",
    urltag:"",
    useSecureConnection:true,
    user:{
      id:"YqxcBngHv4nt3j1VstTjQj0X",
      role:"sub"
    },
    widget:{
      guid:"",
      inline:false,
      instance:"",
      version:328
    }
  };


http.ServerResponse.prototype.writeError = function(code, desc) {
  this.writeHead(code, {
    "Content-Type": mimeTypes.txt
  });
  this.end(desc + "\n");
};


function validateArgs(args) {
  for(var i in defaultArgs) {
    var defaultArg = defaultArgs[i];
    if(args[i] === undefined) {

      if(defaultArg.required) {
        if(!defaultArg.val) {
          throw new Error("Missing '" + i + "' parameter")
        }
        else if(defaultArg.val) {
          args[i] = defaultArg.val;
        }
      }
    }
  }
}


function local(args, cb) {
  try {
    var argObj = common.parseArgs(args);
    validateArgs(argObj);
  } catch (x) {
    return cb("Error processing args: " + x + "\nUsage: " + local.usage);
  }

  if(argObj.packages) {
    argObj.packages = argObj.packages.split(",");
  }
  if(argObj.proxy !== undefined) {
    argObj.proxy = argObj.proxy === "false" ? false : true;
  }

  var server = new LocalServer(argObj);
  server.start(argObj.port);
}



function LocalServer(options) {

  this.subDomain = options.domain || "apps";
  this.baseDomain = options.baseDomain || "feedhenry.com"

  this.domain = this.subDomain + "." + options.baseDomain;
  this.guid = options.app || options.guid || "";
  this.main = options.main || "index.html";
  this.packages = (options.packages || []).concat("default","../shared");
  this.proxy = options.proxy !== undefined ? options.proxy : true;

  this.server = http.createServer(this.handleRequest.bind(this));

  this.millicore = new Millicore();
}
util.inherits(LocalServer, events.EventEmitter);


LocalServer.prototype.start = function(port) {
  this.server.listen(port);

  this.millicore.init();
  console.log("server listening on port:", port);
  console.log("go to http://127.0.0.1:" + port + "/ in your browser");
};

LocalServer.prototype.handleRequest = function(request, response) {
  if(request.method === "POST") {

    if(this.proxy) {
      this.proxyActRequest(request, response);
    }
    else {
      this.handleActRequest(request, response);
    }
  }
  else {
    this.handleFileRequest(request, response)
  }
};

LocalServer.prototype.proxyActRequest = function(request, response) {
  var requestParams = url.parse(request.url, true),
    uri = requestParams.pathname,
    host = request.headers.host.split(":")[0] || "localhost",
    uriComponents = uri.split("/"),
    params = "";

  log.silly("Proxying act request");
  log.silly(uri, "url");
  log.silly(uriComponents[uriComponents.length - 2], "act");

  var proxyReq = https.request({
    path: uri,
    method: request.method,
    host: this.domain,
    headers: request.headers
  }, function(proxyRes) {
    response.writeHead(proxyRes.statusCode, proxyRes.headers);

    proxyRes.on("data", function(chunk) {
      response.write(chunk);
    });
    proxyRes.on("end", function() {
      response.end();
    });
  });

  request.on("data", function(chunk) {
    params += chunk.toString();
    proxyReq.write(chunk);
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

LocalServer.prototype.handleActRequest = function(request, response) {
  this.millicore.handleRequest(request, response);
};


LocalServer.prototype.handleFileRequest = function(request, response) {
  var self = this,
    requestParams = url.parse(request.url, true),
    uri = requestParams.pathname,
    host = request.headers.host.split(":")[0] || "localhost";


  this.getPackageFile(uri, function(exists, filename) {
    if(!exists) {
      return response.writeError(404, "Not Found");
    }

    fs.readFile(filename, "binary", function(err, file) {
      if(err) {
        return response.writeError(500, err);
      }

      response.writeHead(200, {
        "content-type": mimeTypes[filename.split(".").pop()] || mimeTypes.txt
      });


      if(filename.indexOf(self.main) >= 0) {
        response.end(self.buildMain(file, requestParams.query));
      }
      else {
        response.end(file, "binary");
      }
    });
  });
};



LocalServer.prototype.buildMain = function(file, requestQuery) {
  var html = new Element("html"),
    head = new Element("head"),
    body = new Element("body"),
    initScript = new Element("script");
    apiScript = new Element("script"),
    contentType = new Element("meta");

  contentType.setAttribute("http-equiv", "Content-Type" );
  contentType.setAttribute("content", "text/html; charset=utf-8");
  head.append(contentType);


  if(requestQuery.device !== undefined && requestQuery.version !== undefined) {
    var viewport = new Element("meta");
    viewport.setAttribute("name", "viewport");
    viewport.setAttribute("content", "width=device-width, height=device-height, user-scalable=no");
    apiScript.setAttribute("src", "http://" + 
      this.domain + "/static/mac/script/" + 
      requestQuery.device + "_" + 
      requestQuery.version + "/167-scripts.js");

    head.append(viewport);
  }
  else {
    apiScript.setAttribute("src", "https://" + this.domain + "/static/pec/script/studio/155-scripts.js");
  }

  initParams.widget.guid = this.guid;
  initParams.widget.instance = this.guid;

  initScript.append("$fhclient = $fh.init(" + JSON.stringify(initParams) + ");");


  head.append(apiScript);
  head.append(initScript);
  body.append(file);
  html.append(head);
  html.append(body);

  return html.toString();
};

LocalServer.prototype.getPackageFile = function(uri, cb) {
  var lookupIndex = 0,
    packages = this.packages,
    self = this;

  (function checkNextPath() {
    var filename = path.join(process.cwd(), "client", packages[lookupIndex++], uri);

    path.exists(filename, function(exists) {
      if(!exists) {//try the next one
        if(lookupIndex >= packages.length) {
          cb && cb(false);
        }
        else {
          checkNextPath();
        }

      }
      else if (fs.statSync(filename).isDirectory()) {
        uri += '/' + self.main;
        lookupIndex--;
        checkNextPath();
      }
      else {
        cb && cb(true, filename);
      }
    });
  })();

};


function Millicore(options) {
  var options = options || {};
  this.main = options.main || "./cloud/main.js";
  this.env = null;
  this.legacy = false;
}
Millicore.prototype.init = function() {
  try {
    this.env = require(path.join(process.cwd(), this.main));
  }
  catch(e) {
    console.log("There doesn't seem to be any cloud code here: ");
  }
};

Millicore.prototype.handleRequest = function(request, response) {
  var self = this,
    url = request.url,
    urlComponents = url.split("/"),
    paramString = "",
    act = urlComponents[urlComponents.length - 2];



  request.on("data", function(chunk) {
    paramString += chunk.toString();
  });

  request.on("end", function() {
    var params;

    try  {
      self.act(act, JSON.parse(paramString), function(err, res) {
        if(err) {
          self.handleError(err, response);
        }
        else {
          self.doResponse(res, response);
        }
      });
    }
    catch(e) {
      return self.handleError(e, response);
    }

  });
};

Millicore.prototype.handleError = function(err, response) {
  this.doResponse({
    status: "error",
    message: err.message
  }, response);
};

Millicore.prototype.doResponse = function(data, response) {
  response.end(JSON.stringify(data));
};

Millicore.prototype.act = function(act, params, cb) {
  try {
    this.env[act](params, cb);
  }
  catch(e) {
    cb(e);
  }
};


function Element(tag) {
  this.tag = tag;
  this.children = [];
  this.attributes = {};
}

Element.prototype.append = function(child) {
  this.children.push(child);
};

Element.prototype.setAttribute = function(key, value) {
  this.attributes[key] = value;
};

Element.prototype.toString = function() {
  var attributes = this.attributes,
    children = this.children,
    tag = this.tag,
    string = "<" + tag;

  for(var key in attributes) {
    string += " " + key + "=\"" + attributes[key] + "\"";
  }
  string += ">" + children.join("") + "</" + tag + ">";

  return string;
};