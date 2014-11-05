module.exports = call;
call.usage = "fhc call <url> [<method> <params>]";
call.desc = "Call a FeedHenry system URL";

var util = require('util');
var fhc = require("../../fhc");
var fhreq = require("../../utils/request");

// Get FeedHenry platform call
function call (argv, cb) {
  var args = argv._;
  var host = fhreq.getFeedHenryUrl();

  if (args.length === 0) {
    return cb(call.usage);
  }

  var url = args[0];
  var method = args[1] || 'GET';
  var data = args[2] || '{}';


//function GET (url, where, etag, nofollow, cb) {
  fhreq.requestFunc(host, method, url, data, function (err, remoteData, raw, response) {
    if (err) return cb(err);
    if (response.statusCode === 200) {
      if ('object' === typeof remoteData) {
        remoteData.status = "ok";
        remoteData.statusCode = 200;
      } else {
        remoteData = {
          "body" : raw,
          "status" : "ok",
          "statusCode" : response.statusCode
        };
      }
      call.message = raw;
      return cb(err, remoteData);
    }
    return cb(undefined, {status: 'error', error: remoteData, statusCode: response.statusCode});
  });
}
