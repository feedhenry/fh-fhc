module.exports = themes;
themes.usage = "fhc themes [list]\n" +
               "fhc themes create <theme-file.json>\n" +
               "fhc themes update <theme-file.json>\n" +
               "fhc themes get <theme-id>\n" +
               "fhc themes delete <theme-id>\n" +
               "fhc themes app get <app-id>\n" +
               "fhc themes app set <app-id> <theme-id>";
themes.desc = "Manage forms themes";
themes.doUpdate = doUpdate;

var fs = require('fs');
var util = require('util');
var fhc = require("../../fhc");
var fhreq = require("../../utils/request");

// Get FeedHenry plattheme version
function themes (argv, cb) {
  var args = argv._;
  var url = fhreq.getFeedHenryUrl();
  if (args.length === 0) return doList(cb);
  var action = args[0];

  if (action === 'list') return doList(cb);
  if (action === 'create') {
    if (!args[1]) return cb(themes.usage);
    return doCreateUpdate(args[1], cb);
  }
  if (action === 'update') {
    if (!args[1]) return cb(themes.usage);
    return doCreateUpdate(args[1], cb);
  }
  if (action === 'get') {
    if (!args[1]) return cb(themes.usage);
    return doGetTheme(args[1], cb);
  }
  if (action === 'delete') {
    if (!args[1]) return cb(themes.usage);
    return doDeleteTheme(args[1], cb);
  }
  if (action === 'app') {
    if (!args[1]) return cb(themes.usage);
    var act = args[1];
    if (act === 'get') {
      var appId = args[2];
      if (!appId) return cb(themes.usage);
      return doGetAppTheme(appId, cb);
    }
    if (act === 'set') {
      var appId = args[2];
      if (!appId) return cb(themes.usage);
      var themeId = args[3];
      return doSetAppTheme(appId, themeId, cb);
    }
  }
  return cb(themes.usage);
}

function doList(cb) {
  fhreq.GET(fhreq.getFeedHenryUrl(), "api/v2/forms/theme", function (err, remoteData, raw, res) {
    if (err) return cb(err);
    if (res.statusCode !== 200) return cb('Unexpected response code: ' + res.statusCode + ' - ' + raw);

    remoteData.status = "ok";
    remoteData.statusCode = 200;
    return cb(err, remoteData);
  });
}

function doCreateUpdate(file, cb) {
  if (!fs.existsSync(file)) return cb("File does not exist: " + file);
  fs.readFile(file, function(err, data) {
    if (err) return cb(err);
    var theme = JSON.parse(data);
    doUpdate(theme, cb);
  });
}

// do the actual update, this api is used in fh-art directly
function doUpdate(theme, cb) {
  fhreq.POST(fhreq.getFeedHenryUrl(), "api/v2/forms/theme", theme, function (err, remoteData, raw, res) {
    if (err) return cb(err);
    if (res.statusCode !== 200) return cb('Unexpected response code: ' + res.statusCode + ' - ' + raw);

    remoteData.status = "ok";
    remoteData.statusCode = 200;
    return cb(err, remoteData);
  });
}

function doGetTheme(themeId, cb) {
  fhreq.GET(fhreq.getFeedHenryUrl(), "api/v2/forms/theme/" + themeId, function (err, remoteData, raw, res) {
    if (err) return cb(err);
    if (res.statusCode !== 200) return cb('Unexpected response code: ' + res.statusCode + ' - ' + raw);

    remoteData.status = "ok";
    remoteData.statusCode = 200;
    return cb(err, remoteData);
  });
}

function doDeleteTheme(themeId, cb) {
  fhreq.DELETE(fhreq.getFeedHenryUrl(), "api/v2/forms/theme/" + themeId, function (err, remoteData, raw, res) {
    if (err) return cb(err);
    if (res.statusCode !== 200) return cb('Unexpected response code: ' + res.statusCode + ' - ' + raw);

    remoteData.status = "ok";
    remoteData.statusCode = 200;
    return cb(err, remoteData);
  });
}

function doGetAppTheme(appId, cb) {
  fhreq.GET(fhreq.getFeedHenryUrl(), "api/v2/forms/apps/" + appId, function (err, remoteData, raw, res) {
    if (err) return cb(err);
    if (res.statusCode !== 200) return cb('Unexpected response code: ' + res.statusCode + ' - ' + raw);

    // remove the 'forms' array, we're only looking for the .theme here
    delete remoteData.forms;
    remoteData.status = "ok";
    remoteData.statusCode = 200;
    return cb(err, remoteData);
  });
}

function doSetAppTheme(appId, themeId, cb) {
  fhreq.POST(fhreq.getFeedHenryUrl(), "api/v2/forms/apps/" + appId, {theme: themeId}, function (err, remoteData, raw, res) {
    if (err) return cb(err);
    if (res.statusCode !== 200) return cb('Unexpected response code: ' + res.statusCode + ' - ' + raw);

    remoteData.status = "ok";
    remoteData.statusCode = 200;
    return cb(err, remoteData);
  });
}
