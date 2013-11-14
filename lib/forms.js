module.exports = forms;
forms.usage = "fhc forms [list]" +
              "fhc forms create <form-file.json>";

var fs = require('fs');
var util = require('util');
var fhc = require("./fhc");
var fhreq = require("./utils/request");

// Get FeedHenry platform version
function forms (args, cb) {
  console.log("args: " + util.inspect(args))
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
    fhreq.POST(fhreq.getFeedHenryUrl(), "api/v2/forms/form", form, function (err, remoteData, raw, res) {
      if (err) return cb(err);
      if (res.statusCode !== 200) return cb('Unexpected response code: ' + res.statusCode + ' - ' + raw);

      remoteData.status = "ok";
      remoteData.statusCode = 200;
      return cb(err, remoteData);
    });
  });
};




