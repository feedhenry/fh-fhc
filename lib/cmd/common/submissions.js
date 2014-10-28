module.exports = submissions;

submissions.desc = "Manage forms submissions";
submissions.usage = "fhc submissions [list]\n" +
              "fhc submissions list app=<app-id> form=<form-id>\n" +
              "fhc submissions get <submission-id>\n" +
              "fhc submissions get <submission-id> <filename>.pdf\n" +
              "fhc submissions delete <submission-id>\n" +
              "fhc submissions getfile <filegroup-id> <outputfilename>\n" +
              "fhc submissions submitdata <submission-file.json>\n" +
              "fhc submissions submitfile <submission-id> <field-id> <file-id> <file>\n" +
              "fhc submissions complete <submission-id>\n" +
              "fhc submissions status <submission-id>\n" +
              "fhc submissions export file=<zip-file> app=<app-id> || form=<form-id>\n" +
              "fhc submissions template <app-id> <form-id>";
submissions.doList = doList;
submissions.doGetSubmission = doGetSubmission;

var fs = require('fs');
var util = require('util');
var fhc = require("../../fhc");
var fhreq = require("../../utils/request");
var url = require('url');
var http = require('http');
var https = require('https');
var forms = require('./forms.js');
var request = require('request');

// Get FeedHenry platform version
function submissions (argv, cb) {
  var args = argv._;
  var url = fhreq.getFeedHenryUrl();
  if (args.length === 0) return doList(null, cb);
  var action = args[0];

  if (action === 'list') {
    args.shift(); // get rid of 'list'
    return doList(args, cb);
  }
  if (action === 'get') {
    if (!args[1]) return cb(submissions.usage);
    if (args[2]) return doExportPdf(args[1], args[2], cb);
    return doGetSubmission(args[1], cb);
  }
  if (action === 'delete') {
    if (!args[1]) return cb(submissions.usage);
    return doDeleteSubmission(args[1], cb);
  }
  if (action === 'getfile') {
    if (!args[1] || !args[2]) return cb(submissions.usage);
    return doGetSubmissionFile(args[1], args[2], cb);
  }
  if (action === 'submitdata') {
    if (!args[1]) return cb(submissions.usage);
    return doSubmit(args[1], cb);
  }
  if (action === 'submitfile') {
    if (!args[1] || !args[2] || !args[3] || !args[4]) return cb(submissions.usage);
    return doSubmitFile(args[1], args[2], args[3], args[4], cb);
  }
  if (action === 'complete') {
    if (!args[1]) return cb(submissions.usage);
    return doComplete(args[1], cb);
  }
  if (action === 'status') {
    if (!args[1]) return cb(submissions.usage);
    return doStatus(args[1], cb);
  }
  if (action === 'export') {
    args.shift(); // get rid of 'export'
    return doExport(args, cb);
  }
  if (action === 'template') {
    var appId = args[1];
    var formId = args[2];
    if (!appId || !formId) return cb(submissions.usage);
    return doTemplate(appId, formId, cb);
  }

  return cb(submissions.usage);
}

// parses the args for 'app=xxx' and 'form=yyy'
function getAppFormIds(args, cb) {
  var appId, formId, file;
  if (!args) return cb(null, appId, formId, file);
  for (var i=0; i<args.length; i++) {
    var arg = args[i];
    if (arg.indexOf('app=') === 0){
      appId = arg.replace('app=', '');
    }else if (arg.indexOf('form=') === 0){
      formId = arg.replace('form=', '');
    }else if (arg.indexOf('file=') === 0){
      file = arg.replace('file=', '');
    }else {
      return cb('Unknown argument: ' + arg + '\n' + submissions.usage);
    }
  }
  process.nextTick(function() {
    return cb(null, appId, formId, file);
  });
}

function doList(args, cb) {
  var payload = {};
  getAppFormIds(args, function(err, appId, formId) {
    if (err) return cb(err);

    if (appId) payload.appId = appId;
    if (formId) payload.formId = formId;
    payload.wantRestrictions = false;

    fhreq.POST(fhreq.getFeedHenryUrl(), "api/v2/forms/submission", payload, function (err, remoteData, raw, res) {
      if (err) return cb(err);
      if (res.statusCode !== 200) return cb('Unexpected response code: ' + res.statusCode + ' - ' + raw);

      remoteData.status = "ok";
      remoteData.statusCode = 200;
      return cb(err, remoteData);
    });
  });
}

function doGetSubmission(submissionId, cb) {
  fhreq.GET(fhreq.getFeedHenryUrl(), "api/v2/forms/submission/" + submissionId, function (err, remoteData, raw, res) {
    if (err) return cb(err);
    if (res.statusCode !== 200) return cb('Unexpected response code: ' + res.statusCode + ' - ' + raw);

    remoteData.status = "ok";
    remoteData.statusCode = 200;
    return cb(err, remoteData);
  });
}

function doDeleteSubmission(submissionId, cb) {
  fhreq.DELETE(fhreq.getFeedHenryUrl(), "api/v2/forms/submission/" + submissionId, function (err, remoteData, raw, res) {
    if (err) return cb(err);
    if (res.statusCode !== 200) return cb('Unexpected response code: ' + res.statusCode + ' - ' + raw);

    remoteData.status = "ok";
    remoteData.statusCode = 200;
    return cb(err, remoteData);
  });
}

function doGetSubmissionFile(fileGroupId, outputFileName, cb) {
  //TODO the main part of this function should be moved into utils/request.js
  var fhUrl = url.resolve(fhreq.getFeedHenryUrl(),  "api/v2/forms/submission/file/" + fileGroupId);

  var uri = url.parse(fhUrl);
  var proto = uri.protocol === 'https:' ? https : http;

  var headers = {};
  var cookie = fhc.config.get("cookie");
  if (cookie !== undefined) {
    headers.cookie = "feedhenry=" + cookie + ";";
  }

  uri.headers = headers;

  var req = proto.get(uri, function(res){
    if(res.statusCode !== 200) return cb("Unexpected response code for file download: " + res.statusCode + " message: " + res.body);

    var stream = fs.createWriteStream(outputFileName);
    res.on('data',function (chunk) {
      stream.write(chunk);
    });

    res.on('end',function (){
      stream.end(function () {
        return cb(undefined, {status: "ok", statusCode: res.statusCode, url: fhUrl, file: outputFileName});
      });
    });
  });

  req.on('error',function(err){
     return cb("Error downloading file: " + err.message);
  });
}

function doSubmit(file, cb) {
  if (!fs.existsSync(file)) return cb("File does not exist: " + file);
  fs.readFile(file, function(err, data) {
    if (err) return cb(err);
    var sub = JSON.parse(data);
    if (!sub.formId) return cb("'formId' missing from submission");
    var url = "api/v2/forms/submission/" + sub.formId + '/submitData';
    fhreq.POST(fhreq.getFeedHenryUrl(), url, sub, function (err, remoteData, raw, res) {
      if (err) return cb(err);
      if (res.statusCode !== 200) return cb('Unexpected response code: ' + res.statusCode + ' - ' + raw);

      remoteData.status = "ok";
      remoteData.statusCode = 200;
      return cb(err, remoteData);
    });
  });
}

function doSubmitFile(submissionId, fieldId, fileId, file, cb) {
  if (!fs.existsSync(file)) return cb("File does not exist: " + file);
  var url = fhreq.getFeedHenryUrl() + "api/v2/forms/submission/" + submissionId + '/' + fieldId + '/' + fileId + '/submitFile';
  var headers = {};
  var cookie = fhc.config.get("cookie");
  if (cookie) {
    headers.cookie = "feedhenry=" + cookie + ";";
  }

  var r = request.post({url: url, headers: headers}, function(err, res, body) {
    if (err) return cb(err);
    if (res.statusCode !== 200) return cb('Unexpected response code: ' + res.statusCode + ' - ' + body);

    body.status = "ok";
    body.statusCode = 200;
    return cb(err, body);
  });

  r.form().append('fileStream', fs.createReadStream(file));
}

function doComplete(submissionId, cb) {
  var url = "api/v2/forms/submission/" + submissionId + '/complete';
  fhreq.POST(fhreq.getFeedHenryUrl(), url, {}, function (err, remoteData, raw, res) {
    if (err) return cb(err);
    if (res.statusCode !== 200) return cb('Unexpected response code: ' + res.statusCode + ' - ' + raw);

    remoteData.status = "ok";
    remoteData.statusCode = 200;
    return cb(err, remoteData);
  });
}

function doStatus(submissionId, cb) {
  var url = "api/v2/forms/submission/" + submissionId + '/status';
  fhreq.GET(fhreq.getFeedHenryUrl(), url, function (err, remoteData, raw, res) {
    if (err) return cb(err);
    if (res.statusCode !== 200) return cb('Unexpected response code: ' + res.statusCode + ' - ' + raw);

    remoteData.status = "ok";
    remoteData.statusCode = 200;
    return cb(err, remoteData);
  });
}

function doExportPdf(submissionId, file, cb) {
  if (!file) return cb("No file specified, use 'filename.pdf, e.g. '/tmp/file.pdf'\n" + submissions.usage);

  var url = fhreq.getFeedHenryUrl() + "api/v2/forms/submission/" + submissionId + ".pdf";
  doDownload(url, 'get', null, file, cb);
}

function doExport(args, cb) {
  var payload = {};
  getAppFormIds(args, function(err, appId, formId, file) {
    if (err) return cb(err);
    if (!file) return cb("No file specified, use 'file=<zip-file>, e.g. 'file=/tmp/foo.zip'\n" + submissions.usage);

    if (appId) payload.appId = appId;
    if (formId) payload.formId = formId;
    var url = fhreq.getFeedHenryUrl() + "api/v2/forms/submission/export";

    doDownload(url, 'post', payload, file, cb);
  });
}

function doDownload(url, method, payload, file, cb) {
  var headers = {};
  var cookie = fhc.config.get("cookie");
  if (cookie) {
    headers.cookie = "feedhenry=" + cookie + ";";
  }

  var cbCalled = false;
  var f = fs.createWriteStream(file);
  f.on('close', function() {
    if (!cbCalled) {
      cbCalled = true;
      return cb(null, file);
    }
  });

  f.on('error', function(err) {
    if (!cbCalled) {
      cbCalled = true;
      return cb(err);
    }
  });
  var r = request[method]({url: url, json:payload, headers: headers}, function(err, res, body) {
    if (err) {
      if (!cbCalled) {
        cbCalled = true;
        return cb(err);
      }
    }
    if(res.statusCode !== 200) {
      if (!cbCalled) {
        cbCalled = true;
        return cb(body);
      }
    }
  });
  r.on('error', function(err) {
    if (!cbCalled) {
      cbCalled = true;
      return cb(err);
    }
  });
  r.pipe(f);
}

function doTemplate(appId, formId, cb) {
  forms(['get', formId], function(err, form) {
    if (err) return cb(err);

    var sub = {
      "appId": appId,
      "formId": formId,
      "appCloudName": "<app-cloud-name>",
      "appEnvironment": "dev",
      "userId": "<used-id>",
      "deviceId": "<device-id>",
      "deviceIPAddress": "192.168.1.1",
      "timezoneOffset": 120,
      "deviceFormTimestamp": new Date(Date.now()).toUTCString(),
      "comments": [{
        "madeBy": "somePerson@example.com",
        "madeOn": new Date(Date.now()).toUTCString(),
        "value": "This is a comment"
      }]
    };

    // now create dummy form field submission values based on the forms form fields
    var fields = [];
    form.pages.forEach(function(page) {
      page.fields.forEach(function(field) {
        if (field.type !== 'matrix' && field.type !== 'sectionBreak') {
          fields.push(field);
        }
      });
    });

    var formFields = [];
    fields.forEach(function(field) {
      var ff = {
        fieldId: field._id,
        fieldValues: []
      };

      if (field.repeating === true) {
        for (var i=0; i<field.fieldOptions.definition.maxRepeat; i++) {
          ff.fieldValues.push(sampleValue(field, (i+1)));
        }
      }else {
        ff.fieldValues.push(sampleValue(field));
      }

      // write out field metadata to the submission to help fill in submission (sent to the server but ignored)
      ff.meta = field;
      formFields.push(ff);
    });

    sub.formFields = formFields;

    return cb(null, sub);
  });
}

function sampleValue(field, num) {
  if (field.type === 'number') return num ? 42 + num: 42;
  if (field.type === 'emailAddress') return num ? 'foo' + num + '@example.com' : 'foo@example.com';
  if (field.type === 'dateTime') {
    if (field.fieldOptions.definition.datetimeUnit === 'time') {
      return '11:11:11';
    } else if (field.fieldOptions.definition.datetimeUnit === 'date') {
      return new Date().toISOString().substring(0,10);
    } else {
      return new Date().toISOString().replace('T',' ').substring(0,19);
    }
  }
  if (field.type === 'radio') return field.fieldOptions.definition.options[0].label;
  if (field.type === 'dropdown') return field.fieldOptions.definition.options[0].label;
  if (field.type === 'location') {
    if (field.fieldOptions.definition.locationUnit === 'eastnorth') {
      return {"zone" : "11U", "eastings" : "594934", "northings" : "5636174"};
    }
    return {"lat" : "5.555848", "long" : "-52.031250"};
  }
  if (field.type === 'locationMap') {
    return {"lat" : "5.555848", "long" : "-52.031250"};
  }
  if (field.type === 'file' || field.type === 'photo' || field.type === 'signature'){
    var f = {
      "fileName" : field.name + (num ? num: ''),
      "fileSize" : (field && field.fieldOptions && field.fieldOptions.definition && field.fieldOptions.definition.file_size)?field.fieldOptions.definition.file_size:42,
      "fileType" : field.type === 'photo' ? "application/jpeg" : "application/pdf",
      "fileUpdateTime" : new Date().getTime(),
      "hashName" : "filePlaceHolder123456"
    };
    return f;
  }
  if (field.type === 'checkboxes') {
    var sel = {
      selections: []
    };
    for (var i=0; i<field.fieldOptions.definition.options.length; i++) {
      var box = field.fieldOptions.definition.options[i];
      sel.selections.push(box.label);
    }
    return sel;
  }
  return "<" + field.name + (num ? '-' + num : '') + ">";
}
