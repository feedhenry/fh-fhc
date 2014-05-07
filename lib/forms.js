var common = require("./common");
var _ = require('underscore');
module.exports = forms;
forms.usage = "fhc forms [list]\n" +
              "fhc forms create <form-file.json>\n" +
              "fhc forms update <form-file.json>\n" +
              "fhc forms get <form-id>\n" +
              "fhc forms export <form-id>\n" +
              "fhc forms delete <form-id>\n" +
              "fhc forms apps list\n" +
              "fhc forms apps get <app-id>\n" +
              "fhc forms apps update <app-id> <form-id>*\n" +
              "fhc forms apps create <app-title> <theme-id> <form-id>*\n" +
              "fhc forms formapps <form-id>\n" +
              "fhc forms groups [list]\n" +
              "fhc forms groups get <group-id>\n" +
              "fhc forms groups update <group-id> <group-name> <user-id>* <form-id>* <app-id>* <theme-id>*   # user-id and form-id should be a comma-seperated list of values\n" +
              "fhc forms groups create <group-name> <user-id>* <form-id>* <app-id>* <theme-id>*              # user-id and form-id should be a comma-seperated list of values\n" +
              "fhc forms groups delete <group-id>\n" +
              "fhc forms config get <app-id>\n" +
              "fhc forms config create <app-id> <config-file.json>\n" +
              "fhc forms config update <app-id> <config-file.json>\n" +
              "fhc forms config delete <app-id>\n" +
              "fhc forms notifications [list] <form-id>\n" +
              "fhc forms notifications add <form-id> <email-address>\n" +
              "fhc forms notifications delete <form-id> <email-address>\n" +
              "";

forms.doUpdate = doUpdate;

var URL_PREFIX_API_FORMS_GROUP = "api/v2/forms/groups";
var URL_PREFIX_API_FORMS_NOTIFICATIONS = "api/v2/forms/form/{{formId}}/notifications";
var URL_PREFIX_API_FORMS_FORM = "api/v2/forms/form";
var URL_PREFIX_API_FORMS_APPS = "api/v2/forms/apps";
var URL_PREFIX_API_FORMS_APPCONFIG = URL_PREFIX_API_FORMS_APPS + "/config/{{appId}}";

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
    return doGetForm(args[1],false, cb);
  }
  if (action === 'export') {
    if (!args[1]) return cb(forms.usage);
    return doGetForm(args[1], true, cb);
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

      var formIds = ("" === args[3]) ? [] : _.rest(args, 3);
      //if (formIds.length == 0) return cb(forms.usage);
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
  if (action === 'groups') {
    var act = args[1];
    if ((act === 'list') || (!act)) {
      return doListFormsGroups(cb);
    }
    if (act === 'get') {
      var groupId = args[2];
      if (!groupId) return cb(forms.usage);
      return doGetFormsGroup(groupId, cb);
    }
    if (act === 'update') {
      if (args.length != 8) return cb(forms.usage);
      //do get first then update the object
      var groupId = args[2]; //needed

      var groupName = args[3];  // needed
      var userIds = (""  == args[4]) ? [] : args[4].split(',') ;
      var formIds = (""  == args[5]) ? [] : args[5].split(',');
      var appIds = (""  == args[6]) ? [] : args[6].split(',') ;
      var themeIds = (""  == args[7]) ? [] : args[7].split(',') ;
      return doFormsGroupUpdate(groupId, groupName, userIds, formIds, appIds, themeIds, cb);
    }
    if (act === 'create') {
      if (args.length != 7) return cb(forms.usage);

      var groupName = args[2];
      var userIds = (""  == args[3]) ? [] : args[3].split(',') ;
      var formIds = (""  == args[4]) ? [] : args[4].split(',');
      var appIds = (""  == args[5]) ? [] : args[5].split(',') ;
      var themeIds = (""  == args[6]) ? [] : args[6].split(',') ;
      return doFormsGroupCreate(groupName, userIds, formIds, appIds, themeIds, cb);
    }
    if (act === 'delete') {
      var groupId = args[2];
      if (!groupId) return cb(forms.usage);
      return doDeleteFormsGroup(groupId, cb);
    }
  }

  if (action === 'config') {
    var act = args[1];
    var app = args[2];
    if (!act || !app) return cb(forms.usage);

    if (act === 'get') {
      return doGetAppConfig(app, cb);
    }
    if (act === 'create') {
      var fileName = args[3];
      if (!fileName) return cb(forms.usage);
      return doCreateAppConfig(app, fileName, cb);
    }
    if (act === 'update') {
      var fileName = args[3];
      if (!fileName) return cb(forms.usage);
      return doUpdateAppConfig(app, fileName, cb);
    }
    if (act === 'delete') {
      return doDeleteAppConfig(app, cb);
    }
  }

  if (action === 'notifications') {
    var act = args[1],
    formId = args[2],
    email = args[3];

    if (args.length === 2){
      formId = act;
      act = 'list';
    }else if (args.length <2){
      return cb(forms.usage);
    }

    if (!formId){
      return cb(forms.usage);
    }
    if ((act === 'list')) {
      return doListNotifications(formId, cb);
    }

    if (!email){
      return cb(forms.usage);
    }

    if (act === 'add') {
      return doAddNotification(formId, email, cb);
    }
    if (act === 'delete') {
      return doDeleteNotification(formId, email, cb);
    }
  }
  if (action === 'formapps') {
    if (!args[1]) return cb(forms.usage);
    return doFormApps(args[1], cb);
  }


  return cb(forms.usage);
};

function doList(cb) {
  fhreq.GET(fhreq.getFeedHenryUrl(), URL_PREFIX_API_FORMS_FORM + "/list", function (err, remoteData, raw, res) {
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
  fhreq.POST(fhreq.getFeedHenryUrl(), URL_PREFIX_API_FORMS_FORM + "", form, function (err, remoteData, raw, res) {
    if (err) return cb(err);
    if (res.statusCode !== 200) return cb('Unexpected response code: ' + res.statusCode + ' - ' + raw);

    remoteData.status = "ok";
    remoteData.statusCode = 200;
    return cb(err, remoteData);
  });
};

function doGetForm(formId, isExport, cb) {
  var url = URL_PREFIX_API_FORMS_FORM + "/" + formId;
  if(isExport  && "function" !== typeof isExport) url+="?export=true";
  fhreq.GET( fhreq.getFeedHenryUrl() , url, function (err, remoteData, raw, res) {
    if (err) return cb(err);
    if (res.statusCode !== 200) return cb('Unexpected response code: ' + res.statusCode + ' - ' + raw);

    remoteData.status = "ok";
    remoteData.statusCode = 200;
    return cb(err, remoteData);
  });
};

function doDeleteForm(formId, cb) {
  fhreq.DELETE(fhreq.getFeedHenryUrl(), URL_PREFIX_API_FORMS_FORM + "/" + formId, function (err, remoteData, raw, res) {
    if (err) return cb(err);
    if (res.statusCode !== 200) return cb('Unexpected response code: ' + res.statusCode + ' - ' + raw);

    remoteData.status = "ok";
    remoteData.statusCode = 200;
    return cb(err, remoteData);
  });
};

function doGetAppForms(appId, cb) {
  fhreq.GET(fhreq.getFeedHenryUrl(), URL_PREFIX_API_FORMS_APPS + "/" + appId, function (err, remoteData, raw, res) {
    if (err) return cb(err);
    if (res.statusCode !== 200) return cb('Unexpected response code: ' + res.statusCode + ' - ' + raw);

    remoteData.status = "ok";
    remoteData.statusCode = 200;
    return cb(err, remoteData);
  });
};

function doListAppForms(cb) {
  fhreq.GET(fhreq.getFeedHenryUrl(), URL_PREFIX_API_FORMS_APPS + "", function (err, remoteData, raw, res) {
    if (err) return cb(err);
    if (res.statusCode !== 200) return cb('Unexpected response code: ' + res.statusCode + ' - ' + raw);

    remoteData.status = "ok";
    remoteData.statusCode = 200;
    return cb(err, remoteData);
  });
};

function doAppFormsUpdate(appId, formIds, cb) {
  fhreq.POST(fhreq.getFeedHenryUrl(), URL_PREFIX_API_FORMS_APPS + "/" + appId, {forms: formIds}, function (err, remoteData, raw, res) {
    if (err) return cb(err);
    if (res.statusCode !== 200) return cb('Unexpected response code: ' + res.statusCode + ' - ' + raw);

    remoteData.status = "ok";
    remoteData.statusCode = 200;
    return cb(err, remoteData);
  });
};

function doAppFormsCreate(appTitle, appTheme, formIds, cb) {
  fhreq.POST(fhreq.getFeedHenryUrl(), URL_PREFIX_API_FORMS_APPS + "", {title: appTitle, theme: appTheme, forms: formIds}, function (err, remoteData, raw, res) {
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

function doListFormsGroups(cb) {
  fhreq.GET(fhreq.getFeedHenryUrl(), URL_PREFIX_API_FORMS_GROUP + "", function (err, remoteData, raw, res) {
    if (err) return cb(err);
    if (res.statusCode !== 200) return cb('Unexpected response code: ' + res.statusCode + ' - ' + raw);

    remoteData.status = "ok";
    remoteData.statusCode = 200;
    return cb(err, remoteData);
  });
};

function doGetFormsGroup(groupId, cb) {
  fhreq.GET(fhreq.getFeedHenryUrl(), URL_PREFIX_API_FORMS_GROUP + "/" + groupId, function (err, remoteData, raw, res) {
    if (err) return cb(err);
    if (res.statusCode !== 200) return cb('Unexpected response code: ' + res.statusCode + ' - ' + raw);

    remoteData.status = "ok";
    remoteData.statusCode = 200;
    return cb(err, remoteData);
  });
};

function doFormsGroupUpdate(groupId, groupName, userIds, formIds, appIds, themeIds, cb) {
  fhreq.POST(fhreq.getFeedHenryUrl(), URL_PREFIX_API_FORMS_GROUP + "/" + groupId, {name: groupName, users: userIds, forms: formIds, apps: appIds, themes: themeIds}, function (err, remoteData, raw, res) {
    if (err) return cb(err);
    if (res.statusCode !== 200) return cb('Unexpected response code: ' + res.statusCode + ' - ' + raw);

    remoteData.status = "ok";
    remoteData.statusCode = 200;
    return cb(err, remoteData);
  });
};

function doFormsGroupCreate(groupName, userIds, formIds, appIds, themeIds, cb) {
  fhreq.POST(fhreq.getFeedHenryUrl(), URL_PREFIX_API_FORMS_GROUP + "", {name: groupName, users: userIds, forms: formIds, apps: appIds, themes: themeIds}, function (err, remoteData, raw, res) {
    if (err) return cb(err);
    if (res.statusCode !== 200) return cb('Unexpected response code: ' + res.statusCode + ' - ' + raw);

    remoteData.status = "ok";
    remoteData.statusCode = 200;
    return cb(err, remoteData);
  });
};

function doDeleteFormsGroup(groupId, cb) {
  fhreq.DELETE(fhreq.getFeedHenryUrl(), URL_PREFIX_API_FORMS_GROUP + "/" + groupId, function (err, remoteData, raw, res) {
    if (err) return cb(err);
    if (res.statusCode !== 200) return cb('Unexpected response code: ' + res.statusCode + ' - ' + raw);

    remoteData.status = "ok";
    remoteData.statusCode = 200;
    return cb(err, remoteData);
  });
};

function doGetAppConfig(app, cb) {
  var path = URL_PREFIX_API_FORMS_APPCONFIG.replace('{{appId}}', app);

  fhreq.GET(fhreq.getFeedHenryUrl(), path, function (err, remoteData, raw, res) {
    if (err) return cb(err);
    if (res.statusCode !== 200) return cb('Unexpected response code: ' + res.statusCode + ' - ' + raw);

    remoteData.status = "ok";
    remoteData.statusCode = 200;
    return cb(err, remoteData);
  });
}

function doDeleteAppConfig(app, cb) {
  var path = URL_PREFIX_API_FORMS_APPCONFIG.replace('{{appId}}', app);

  fhreq["DELETE"](fhreq.getFeedHenryUrl(), path, function (err, remoteData, raw, res) {
    if (err) return cb(err);
    if (res.statusCode !== 200) return cb('Unexpected response code: ' + res.statusCode + ' - ' + raw);

    remoteData.status = "ok";
    remoteData.statusCode = 200;
    return cb(err, remoteData);
  });
}

function doCreateAppConfig(app, fileName, cb) {
  doCreateUpdateAppConfig("create", app, fileName, cb);
}

function doUpdateAppConfig(app, fileName, cb) {
  doCreateUpdateAppConfig("update", app, fileName, cb);
}

function doCreateUpdateAppConfig(operation, app, fileName, cb) {
  fs.readFile(fileName, function(err, data) {
    if (err) return cb(err);
    var configData = JSON.parse(data);
    doCreateUpdateAppConfigJSON(operation, app, configData, cb);
  });
}

function doCreateUpdateAppConfigJSON(operation, app, configData, cb) {
  var HTTP_METHOD;
  if("create" === operation) {
    HTTP_METHOD = "PUT";
  } else {
    HTTP_METHOD = "POST";
  }

  var path = URL_PREFIX_API_FORMS_APPCONFIG.replace('{{appId}}', app);

  fhreq[HTTP_METHOD](fhreq.getFeedHenryUrl(), path, configData, function (err, remoteData, raw, res) {
    if (err) return cb(err);
    if (res.statusCode !== 200) return cb('Unexpected response code: ' + res.statusCode + ' - ' + raw);

    remoteData.status = "ok";
    remoteData.statusCode = 200;
    return cb(err, remoteData);
  });
}

function doListNotifications(formId, cb){
  var path = URL_PREFIX_API_FORMS_NOTIFICATIONS.replace('{{formId}}', formId);
  fhreq.GET(fhreq.getFeedHenryUrl(), path, function (err, remoteData, raw, res) {
    if (err){
      return cb(err);
    }
    if (res.statusCode !== 200){
      return cb('Unexpected response code: ' + res.statusCode + ' - ' + raw);
    }

    remoteData.status = "ok";
    remoteData.statusCode = 200;
    if (!(remoteData.subscribers instanceof Array)){
      return cb("Unexpected response from subscribers list");
    }

    return cb(err, remoteData);
  });
};

function doAddNotification(formId, email, cb){
  doListNotifications(formId, function(err, res){
    if (err){
      return cb(err);
    }
    var subscribers = res.subscribers,
    emails = email.split(',');

    subscribers = subscribers.concat(emails);
    return _updateNotifications(formId, subscribers, cb);
  });
};

function doDeleteNotification(formId, email, cb){
  doListNotifications(formId, function(err, res){
    if (err){
      return cb(err);
    }
    var subscribers = res.subscribers,
    idx = subscribers.indexOf(email);

    if (idx === -1){
      return cb("Email not found in list of subscribers");
    }

    subscribers.splice(idx, 1);
    return _updateNotifications(formId, subscribers, cb);

  });
};

function _updateNotifications(formId, subscribers, cb){
  var path = URL_PREFIX_API_FORMS_NOTIFICATIONS.replace('{{formId}}', formId);
  fhreq.POST(fhreq.getFeedHenryUrl(), path, { subscribers : subscribers }, function (err, remoteData, raw, res) {
    if (err) {
      return cb(err);
    }
    if (res.statusCode !== 200){
      return cb('Unexpected response code: ' + res.statusCode + ' - ' + raw);
    }

    remoteData.status = "ok";
    remoteData.statusCode = 200;
    return cb(err, remoteData);
  });
}

function doFormApps(formId, cb) {
  fhreq.GET(fhreq.getFeedHenryUrl(), "api/v2/forms/" + formId + "/apps", function (err, remoteData, raw, res) {
    if (err) return cb(err);
    if (res.statusCode !== 200) return cb('Unexpected response code: ' + res.statusCode + ' - ' + raw);

    remoteData.status = "ok";
    remoteData.statusCode = 200;
    return cb(err, remoteData);
  });
};
