// template actions
/* globals i18n */
module.exports = templates;
templates.list = list;
templates.read = read;
templates.init = init;

templates.desc = i18n._("App & Project Templates");
templates.usage = "\nfhc templates [list]"
  + "\nfhc templates [read] <template-id>"
  + "\nfhc templates init <template-id>";

templates.usage_ngui = "\nfhc templates apps [<template-id>]"
  + "\nfhc templates projects [<template-id>]"
  + "\nfhc templates services [<template-id>]";

templates.setDeployEnvironment = setDeployEnvironment;

var common = require("../../common");
var ini = require('../../utils/ini');
var fhreq = require("../../utils/request");
var fhc = require("../../fhc");
var fs = require('fs');
var url = require('url');
var http = require("http");
var https = require("https");
var log = require("../../utils/log");
var spawn = require('child_process').spawn;
var _ = require('underscore');
var Table = require('cli-table');
var util = require('util');

var appHeaders = ['Id', 'Name', 'Type', 'Category', 'Repo'];
var appFields = ['id', 'name', 'type', 'category', 'repoUrl'];
var projectHeaders = ['Id', 'Name', 'Type', 'Category'];
var projectFields = ['id', 'name', 'type', 'category'];
var serviceHeaders = ['Id', 'Name', 'Category'];
var serviceFields = ['id', 'name', 'category'];

// main templates entry point
function templates(argv, cb) {
  var args = argv._,
    isNGUI = ini.get('fhversion') >= 3;
  if (isNGUI === false) {
    return oldTemplates(args, cb);
  }

  if (args.length < 1 || args.length > 2) {
    return cb(templates.usage_ngui);
  }

  var action = args[0];
  var templateId = args[1];
  if (action === 'apps') {
    if (templateId) {
      return getTemplate('apps', templateId, cb);
    }
    else {
      return listTemplates('apps', appHeaders, appFields, cb);
    }
  } else if (action === 'projects') {
    if (templateId) {
      return getTemplate('projects', templateId, cb);
    }
    else {
      return listTemplates('projects', projectHeaders, projectFields, cb);
    }
  } else if (action === 'services') {
    // Note: services are known as 'connectors' internally in millicore
    if (templateId) {
      return getTemplate('connectors', templateId, cb);
    }
    else {
      return listTemplates('connectors', serviceHeaders, serviceFields, cb);
    }
  } else {
    return cb(templates.usage_ngui);
  }

}


function listTemplates(type, headers, fields, cb) {
  common.doGetApiCall(fhreq.getFeedHenryUrl(), "box/api/templates/" + type, i18n._("Error reading Templates: "), function (err, temps) {
    if (err) {
      return cb(err);
    }

    var colWidths = _.map(fields, function (f) {
      return common.maxField(temps, f) + 2;
    });

    if (ini.get('table') === true) {
      templates.table = new Table({
        head: headers,
        colWidths: colWidths,
        style: common.style()
      });

      _.each(temps, function (t) {
        var vals = _.map(fields, function (f) {
          return t[f];
        });
        templates.table.push(vals);
      });
    }
    return cb(null, temps);
  });
}

function getTemplate(type, templateId, cb) {
  // TODO: call single item endpoint based on templateId when available
  common.doGetApiCall(fhreq.getFeedHenryUrl(), "box/api/templates/" + type, i18n._("Error reading Templates: "), function (err, temps) {
    if (err) return cb(err);
    var template = _.findWhere(temps, {id: templateId});
    return cb(null, template);
  });
}

// bash completion
templates.completion = function (opts, cb) {
  var argv = opts.conf.argv.remain;
  if (argv[1] !== "templates") {
    argv.unshift("templates");
  }
  if (argv.length === 2) {
    var cmds = ["apps", "projects", "services"];
    return cb(null, cmds);
  }
};


// OLD CODE WARNING
// TODO - deprecate all this, not even used in fh-art
function oldTemplates(args, cb) {

  if (args.length === 0) {
    return list(cb);
  }

  var action = args[0];
  if (action === 'read') {
    var appId = args[1];
    return read(appId, cb);
  } else if (action === 'list') {
    return list(cb);
  } else if (action === 'init') {
    var tempId = args[1];
    // get app guid, as instance guid is no good for downloading
    common.readApp(tempId, function (err, data) {
      if (err) {
        return cb(err);
      }
      return init(data.app.guid, cb);
    });
  } else {
    if (args.length === 1) {
      // assume its a read and a guid has been passed
      return read(args[0], cb);
    }
    return cb(templates.usage);
  }
}

function list(cb) {
  common.listTemplates(function (err, data) {
    if (err) {
      return cb(err);
    }

    if (ini.get('table') === true && data.list) {
      templates.table = common.createTableForTemplates(data.list);
    }

    return cb(err, data);
  });
}

function read(tempId, cb) {
  if (!tempId) {
    return cb(i18n._("No tempId specified!") + ' ' + i18n._("Usage:\n") + templates.usage);
  }

  common.readApp(tempId, function (err, data) {
    if (err) {
      return cb(err);
    }

    if (ini.get('table') === true && data) {
      templates.table = common.createTableForAppProps(data);
    }

    return cb(err, data);
  });
}

function init(tempId, cb) {
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
  log.info(i18n._('options: ') + JSON.stringify(options));
  var requester = port === 443 ? https : http;

  requester.get(options, function (res) {
    res.on('data', function (data) {
      file.write(data);
      log.info(i18n._("writing file: ") + data.length);
    });
    res.on('end', function () {
      file.end();
      log.info(i18n._("request end"));

      // extract zip to current dir
      var unzip = spawn('unzip', [fileName, '-x', 'config.xml', 'ext*']);
      console.log(i18n._('Extracting template source...'));

      unzip.on('exit', function (code) {
        fs.unlinkSync(fileName);
        if (code !== 0) {
          log.error(util.format(i18n._('unzip process exited with code %s'), code));
          return cb(code);
        }
        return cb(undefined, i18n._("Template copied to local file system"));
      });
    });
    res.on('error', function (e) {
      log.error(i18n._("Got error: ") + e.message);
      cb(e);
    });
  }).end();
  log.info(i18n._('Downloading template source...'));
}

function setDeployEnvironment(project, deployEnv) {
  if (project.template && project.template.appTemplates) {
    _.each(project.template.appTemplates, function (appTemplate) {
      appTemplate.autoDeployOnCreate = deployEnv;
    });
  }
}
