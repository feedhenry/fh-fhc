module.exports = submissions;
submissions.usage = "fhc submissions [list]\n" +
              "fhc submissions get <submission-id>\n" + 
              "fhc submissions getfile <submission-id> <outputfilename>"
submissions.doList = doList;
submissions.doGetSubmission = doGetSubmission;

var fs = require('fs');
var util = require('util');
var fhc = require("./fhc");
var fhreq = require("./utils/request");
var url = require('url');
var http = require('http');
var https = require('https');

// Get FeedHenry platform version
function submissions (args, cb) {
  var url = fhreq.getFeedHenryUrl();
  if (args.length === 0) return doList(cb);
  var action = args[0];

  if (action === 'list') return doList(cb);
  if (action === 'get') {
    if (!args[1]) return cb(submissions.usage);
    return doGetSubmission(args[1], cb);
  }
  if (action === 'getfile') {
    if (!args[1] || !args[2]) return cb(submissions.usage);
    return doGetSubmissionFile(args[1], args[2], cb);
  }

  return cb(submissions.usage);
};

function doList(cb) {
  fhreq.POST(fhreq.getFeedHenryUrl(), "api/v2/forms/submission", function (err, remoteData, raw, res) {
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


