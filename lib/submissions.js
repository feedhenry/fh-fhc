module.exports = submissions;
submissions.usage = "fhc submissions [list]\n" +
              "fhc submissions list app=<app-id> form=<form-id>\n";
              "fhc submissions get <submission-id>\n" +
              "fhc submissions delete <submission-id>\n";
              "fhc submissions getfile <submission-id> <outputfilename>\n" +
              "fhc submissions submitdata <submission-file.json>\n" +
              "fhc submissions complete <submission-id>\n" +
              "fhc submissions status <submission-id>\n" +
              "fhc submissions export app=<app-id> form=<form-id>\n";
submissions.doList = doList;
submissions.doGetSubmission = doGetSubmission;

var fs = require('fs');
var util = require('util');
var fhc = require("./fhc");
var fhreq = require("./utils/request");
var url = require('url');
var http = require('http');
var https = require('https');
var request = require('request');

// Get FeedHenry platform version
function submissions (args, cb) {
  var url = fhreq.getFeedHenryUrl();
  if (args.length === 0) return doList(null, null, cb);
  var action = args[0];

  if (action === 'list') {
    args.shift(); // get rid of 'list'
    getAppFormIds(args, function(err, appId, formId) {
      if (err) return cb(err);
      return doList(appId, formId, cb);
    });
  }
  if (action === 'get') {
    if (!args[1]) return cb(submissions.usage);
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
    if (args.length === 0) return cb(submissions.usage);

    getAppFormIds(args, function(err, appId, formId) {
      if (err) return cb(err);
      return doExport(appId, formId, cb);
    });
  }

  return cb(submissions.usage);
};

// parses the args for 'app=xxx' and 'form=yyy'
function getAppFormIds(args, cb) {
  var appId, formId;
  for (var i=0; i<args.length; i++) {
    var arg = args[i];
    if (arg.indexOf('app=') === 0){
      appId = arg.replace('app=', '');
    }else if (arg.indexOf('form=') === 0){
      formId = arg.replace('form=', '');
    }else {
      return cb('Unknown argument: ' + arg + '\n' + submissions.usage);
    }
  };
  return cb(null, appId, formId);
}


function doList(appId, formId, cb) {
  var payload = {};
  if (appId) payload.appId = appId;
  if (formId) payload.formId = formId;

  fhreq.POST(fhreq.getFeedHenryUrl(), "api/v2/forms/submission", payload, function (err, remoteData, raw, res) {
    if (err) return cb(err);
    if (res.statusCode !== 200) return cb('Unexpected response code: ' + res.statusCode + ' - ' + raw);

    remoteData.status = "ok";
    remoteData.statusCode = 200;
    return cb(err, remoteData);
  });
};

function doGetSubmission(submissionId, cb) {
  fhreq.GET(fhreq.getFeedHenryUrl(), "api/v2/forms/submission/" + submissionId, function (err, remoteData, raw, res) {
    if (err) return cb(err);
    if (res.statusCode !== 200) return cb('Unexpected response code: ' + res.statusCode + ' - ' + raw);

    remoteData.status = "ok";
    remoteData.statusCode = 200;
    return cb(err, remoteData);
  });
};

function doDeleteSubmission(submissionId, cb) {
  fhreq.DELETE(fhreq.getFeedHenryUrl(), "api/v2/forms/submission/" + submissionId, function (err, remoteData, raw, res) {
    if (err) return cb(err);
    if (res.statusCode !== 200) return cb('Unexpected response code: ' + res.statusCode + ' - ' + raw);

    remoteData.status = "ok";
    remoteData.statusCode = 200;
    return cb(err, remoteData);
  });
};

function doGetSubmissionFile(fileGroupId, outputFileName, cb) {
  //TODO the main part of this function should be moved into utils/request.js
  var fhUrl = url.resolve(fhreq.getFeedHenryUrl(),  "api/v2/forms/submission/file/" + fileGroupId);

  var uri = url.parse(fhUrl);
  var proto = uri.protocol === 'https:' ? https : http;

  var headers = {};
  var cookie = fhc.config.get("cookie");
  if (cookie != undefined) {
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
};

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
};

function doComplete(submissionId, cb) {
  var url = "api/v2/forms/submission/" + submissionId + '/complete';
  fhreq.POST(fhreq.getFeedHenryUrl(), url, {}, function (err, remoteData, raw, res) {
    if (err) return cb(err);
    if (res.statusCode !== 200) return cb('Unexpected response code: ' + res.statusCode + ' - ' + raw);

    remoteData.status = "ok";
    remoteData.statusCode = 200;
    return cb(err, remoteData);
  });
};

function doStatus(submissionId, cb) {
  var url = "api/v2/forms/submission/" + submissionId + '/status';
  fhreq.GET(fhreq.getFeedHenryUrl(), url, function (err, remoteData, raw, res) {
    if (err) return cb(err);
    if (res.statusCode !== 200) return cb('Unexpected response code: ' + res.statusCode + ' - ' + raw);

    remoteData.status = "ok";
    remoteData.statusCode = 200;
    return cb(err, remoteData);
  });
};

function doExport(appId, formId, cb) {
  var payload = {};
  if (appId) payload.appId = appId;
  if (formId) payload.formId = formId;

  var url = fhreq.getFeedHenryUrl() + "api/v2/forms/submission/export";
  var headers = {};
  var cookie = fhc.config.get("cookie");
  if (cookie) {
    headers.cookie = "feedhenry=" + cookie + ";";
  }
  request.post({url: url, json:payload, headers: headers}, function(err, res, body) {
    if (err) return cb(err);
    if (res.statusCode !== 200) return cb('Unexpected response code: ' + res.statusCode + ' - ' + body);
    return cb(err, body);
  });
};
