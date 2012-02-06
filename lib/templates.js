// template actions
module.exports = templates;
templates.list = list;
templates.read = read;
templates.init = init;

templates.usage = "\nfhc templates [list]"
                + "\nfhc templates [read] <template-id>"
                + "\nfhc templates init <template-id>";

var common = require("./common");
var ini = require('./utils/ini');
var fhreq = require("./utils/request");
var fhc = require("./fhc");
var fs = require('fs');
var url = require('url');
var http = require("http");
var https = require("https");
var log = require("./utils/log");
var spawn = require('child_process').spawn;

// main templates entry point
function templates (args, cb) {
  if (args.length == 0){
    return list(cb);
  }

  var action = args[0];
  if (action == 'read') {
    var appId = args[1];
    return read(appId, cb);
  } else if (action === 'list') {      
    return list(cb);
  } else if (action === 'init'){
    var tempId = args[1];
    // get app guid, as instance guid is no good for downloading
    var temp = common.readApp(tempId, function (err, data) {
      if (err) return cb(err);
      return init(data.app.guid, cb);
    });
  } else{
    if (args.length === 1) {
      // assume its a read and a guid has been passed
      return read(args[0], cb);
    }
    return cb(templates.usage);
  }
}

function list (cb) {
  common.listTemplates(function(err, data){
    if(err) return cb(err);

    if(ini.get('table') === true && data.list) {
      templates.table = common.createTableForTemplates(data.list);
    }

    return cb(err, data);
  });
}

function read (tempId, cb) {
  if (!tempId) return cb("No tempId specified! Usage:\n" + templates.usage);

  common.readApp(tempId, function(err, data){
    if(err) return cb(err);

    if(ini.get('table') === true && data) {
      templates.table = common.createTableForAppProps(data);
    }

    return cb(err, data);
  });
}

function init (tempId, cb) {
  // download fh source .e.g. /box/srv/1.1/dev/editor/widget/download?guid=xxxxxxxxxxxxxxxxxxxxxx
  var asset_url = fhreq.getFeedHenryUrl() + "box/srv/1.1/dev/editor/widget/download";

  var fileName = tempId + ".zip";
  var file = fs.createWriteStream(fileName, {'flags': 'a'});

  var parsedUrl = url.parse(asset_url);
  var port = parsedUrl.protocol.indexOf('https') > -1 ? 443 : 80;
  var cookie = fhc.config.get("cookie");
  var options = {
    host: parsedUrl.host,
    method: 'GET',
    port: port,
    path: parsedUrl.pathname + "?guid=" + tempId,
    headers: {
      "Cookie": "feedhenry=" + cookie + ";"
    }
  };
  log.info('options: ' + JSON.stringify(options));
  var requester = port === 443 ? https : http; 

  requester.get(options, function(res) {
    res.on('data', function(data) {
      file.write(data);
      log.info("writing file: " + data.length);
    });
    res.on('end', function() {
      file.end();
      log.info("request end");

      // extract zip to current dir
      var unzip = spawn('unzip', [fileName, '-x', 'config.xml', 'ext*']);
      console.log('Extracting template source...');

      unzip.on('exit', function (code) {
        fs.unlinkSync(fileName);
        if(code !== 0) {
          log.error('unzip process exited with code ' + code);
          return cb(code);
        }
        return cb(null, "Template copied to local file system");
      });
    });
    res.on('error', function(e) {
      log.error("Got error: " + e.message);
      cb(e);
    });
  }).end();
  console.log('Downloading template source...');
}


// bash completion
templates.completion = function (opts, cb) {
  var argv = opts.conf.argv.remain;
  if (argv[1] !== "templates") argv.unshift("templates");
  if (argv.length === 2) {
    var cmds = ["list", "read", "init"];
    if (opts.partialWord !== "l") cmds.push("list");
    return cb(null, cmds);
  }

  var action = argv[2];
  switch (action) {
    case "init":
    case "read":
      common.getTemplateIds(cb); 
      break;
    case "list":
      return cb(null, []);
    default: return cb(null, []);
  }
};
