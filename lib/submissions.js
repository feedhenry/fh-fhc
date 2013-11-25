module.exports = submissions;
submissions.usage = "fhc submissions [list]\n" +
              "fhc submissions get <submission-id>"
submissions.doList = doList;
submissions.doGetSubmission = doGetSubmission;

var fs = require('fs');
var util = require('util');
var fhc = require("./fhc");
var fhreq = require("./utils/request");

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


