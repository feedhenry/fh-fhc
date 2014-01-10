var common = require("./common");
var _ = require('underscore');
module.exports = forms;
forms.usage = "fhc forms [list]\n" +
              "fhc forms create <form-file.json>\n" +
              "fhc forms update <form-file.json>\n" +
              "fhc forms get <form-id>\n" +
              "fhc forms delete <form-id>\n" +
              "fhc forms apps list\n" +
              "fhc forms apps get <app-id>\n" +
              "fhc forms apps update <app-id> <form-id>*\n" +
              "fhc forms apps create <app-title> <theme-id> <form-id>*\n" +
              "fhc forms formapps <form-id>";

forms.doUpdate = doUpdate;

var fs = require('fs');
var util = require('util');
var fhc = require("./fhc");
var fhreq = require("./utils/request");

// Get FeedHenry platform version
function forms (args, cb) {
  var url = fhreq.getFeedHenryUrl();
  if (args.length === 0) return doList(cb);
  var action = args[0];

  if (action === 'list') return doList(cb);
  if (action === 'create') {
    if (!args[1]) return cb(forms.usage);
    return doCreateUpdate(args[1], cb);
  }
  if (action === 'update') {
    if (!args[1]) return cb(forms.usage);
    return doCreateUpdate(args[1], cb);
  }
  if (action === 'get') {
    if (!args[1]) return cb(forms.usage);
    return doGetForm(args[1], cb);
  }
  if (action === 'delete') {
    if (!args[1]) return cb(forms.usage);
    return doDeleteForm(args[1], cb);
  }
  if (action === 'apps') {
    if (!args[1]) return cb(forms.usage);
    var act = args[1];
    if (act === 'list') {
      return doListAppForms(cb);
    }
    if (act === 'get') {
      var appId = args[2];
      if (!appId) return cb(forms.usage);
      return doGetAppForms(appId, cb);
    }
    if (act === 'update') {
      var appId = args[2];
      if (!appId) return cb(forms.usage);
      var formIds = _.rest(args, 3);
      if (formIds.length == 0) return cb(forms.usage);
      return doAppFormsUpdate(appId, formIds, cb);
    }
    if (act === 'create') {
      var appTitle = args[2];
      if (!appTitle) return cb(forms.usage);
      var appTheme = args[3];
      if (!appTheme) return cb(forms.usage);      
      var formIds = _.rest(args, 4);
      if (formIds.length == 0) return cb(forms.usage);
      return doAppFormsCreate(appTitle, appTheme, formIds, cb);
    }
  }
  if (action === 'formapps') {
    if (!args[1]) return cb(forms.usage);
    return doFormApps(args[1], cb);
  }


  return cb(forms.usage);
};

function doList(cb) {
  fhreq.GET(fhreq.getFeedHenryUrl(), "api/v2/forms/form/list", function (err, remoteData, raw, res) {
    if (err) return cb(err);
    if (res.statusCode !== 200) return cb('Unexpected response code: ' + res.statusCode + ' - ' + raw);

    remoteData.status = "ok";
    remoteData.statusCode = 200;
    return cb(err, remoteData);
  });
};

function doCreateUpdate(file, cb) {
  if (!fs.existsSync(file)) return cb("File does not exist: " + file);
  fs.readFile(file, function(err, data) {
    if (err) return cb(err);
    var form = JSON.parse(data);
    doUpdate(form, cb);
  });
};

// do the actual update, this api is used in fh-art directly
function doUpdate(form, cb) {
  fhreq.POST(fhreq.getFeedHenryUrl(), "api/v2/forms/form", form, function (err, remoteData, raw, res) {
    if (err) return cb(err);
    if (res.statusCode !== 200) return cb('Unexpected response code: ' + res.statusCode + ' - ' + raw);

    remoteData.status = "ok";
    remoteData.statusCode = 200;
    return cb(err, remoteData);
  });
};

function doGetForm(formId, cb) {
  fhreq.GET(fhreq.getFeedHenryUrl(), "api/v2/forms/form/" + formId, function (err, remoteData, raw, res) {
    if (err) return cb(err);
    if (res.statusCode !== 200) return cb('Unexpected response code: ' + res.statusCode + ' - ' + raw);

    remoteData.status = "ok";
    remoteData.statusCode = 200;
    return cb(err, remoteData);
  });
};

function doDeleteForm(formId, cb) {
  fhreq.DELETE(fhreq.getFeedHenryUrl(), "api/v2/forms/form/" + formId, function (err, remoteData, raw, res) {
    if (err) return cb(err);
    if (res.statusCode !== 200) return cb('Unexpected response code: ' + res.statusCode + ' - ' + raw);

    remoteData.status = "ok";
    remoteData.statusCode = 200;
    return cb(err, remoteData);
  });
};

function doGetAppForms(appId, cb) {
  fhreq.GET(fhreq.getFeedHenryUrl(), "api/v2/forms/apps/" + appId, function (err, remoteData, raw, res) {
    if (err) return cb(err);
    if (res.statusCode !== 200) return cb('Unexpected response code: ' + res.statusCode + ' - ' + raw);

    remoteData.status = "ok";
    remoteData.statusCode = 200;
    return cb(err, remoteData);
  });
};

function doListAppForms(cb) {
  fhreq.GET(fhreq.getFeedHenryUrl(), "api/v2/forms/apps", function (err, remoteData, raw, res) {
    if (err) return cb(err);
    if (res.statusCode !== 200) return cb('Unexpected response code: ' + res.statusCode + ' - ' + raw);

    remoteData.status = "ok";
    remoteData.statusCode = 200;
    return cb(err, remoteData);
  });
};

function doAppFormsUpdate(appId, formIds, cb) {
  fhreq.POST(fhreq.getFeedHenryUrl(), "api/v2/forms/apps/" + appId, {forms: formIds}, function (err, remoteData, raw, res) {
    if (err) return cb(err);
    if (res.statusCode !== 200) return cb('Unexpected response code: ' + res.statusCode + ' - ' + raw);

    remoteData.status = "ok";
    remoteData.statusCode = 200;
    return cb(err, remoteData);
  });
};

function doAppFormsCreate(appTitle, appTheme, formIds, cb) {
  fhreq.POST(fhreq.getFeedHenryUrl(), "api/v2/forms/apps", {title: appTitle, theme: appTheme, forms: formIds}, function (err, remoteData, raw, res) {
    if (err) return cb(err);
    if (res.statusCode !== 200) return cb('Unexpected response code: ' + res.statusCode + ' - ' + raw);
    if(remoteData.status == 'pending') {
      return common.waitForJob(remoteData.cacheKey, 0, function(err, data){
        var ret = {};
        if(err) {
          // special handling for error - there could be issues staging the app, but the app will have been created and associated with forms
          if(err[0] && err[0].action && err[0].action.guid) {
            remoteData = err;
          } else {
            return cb(err);
          }
        }
        if(remoteData[0].action && remoteData[0].action.guid){
          ret.guid = remoteData[0].action.guid;
        }
        ret.status = "ok";
        ret.statusCode = 200;
        return cb(undefined, ret);
      });
    }else {
      return cb(undefined, remoteData);
    }
  });
};

function doFormApps(formId, cb) {
  fhreq.GET(fhreq.getFeedHenryUrl(), "api/v2/forms/" + formId + "/apps", function (err, remoteData, raw, res) {
    if (err) return cb(err);
    if (res.statusCode !== 200) return cb('Unexpected response code: ' + res.statusCode + ' - ' + raw);

    remoteData.status = "ok";
    remoteData.statusCode = 200;
    return cb(err, remoteData);
  });
};
