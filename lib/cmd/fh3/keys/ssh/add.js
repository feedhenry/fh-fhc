/* globals i18n */
var common = require('../../../../common.js');
var fhreq = require("../../../../utils/request");
var fs = require('fs');
var fhc = require("../../../../fhc");

module.exports = {
  'desc' : i18n._('Add a SSH Key'),
  'examples' :
    [{
      cmd : 'fhc keys ssh add --label=<label> --file=<file>',
      desc : i18n._("Import a new SSH key from <file> as <label>")
    }],
  'demand' : ['label','file'],
  'alias' : {
    'label': 'l',
    'json': 'j',
    0 : 'label',
    1 : 'file'
  },
  'describe' : {
    'label' : i18n._("Label of the ssh key that you want import."),
    'file' : i18n._("Path with file name of the ssh key that you want import."),
    'json' : i18n._("Output in json format")
  },
  'customCmd': function(params, cb) {
    if (!fs.existsSync(params.file)) {
      return cb(i18n._("File doesn't exist: ") + params.file);
    }

    fs.readFile(params.file, function(err, key) {
      if (err) {
        return cb(err);
      }

      var url = "box/srv/1.1/ide/" + fhc.curTarget + "/user/addKey";
      var payload = {
        label: params.label,
        key: key.toString()
      };
      common.doApiCall(fhreq.getFeedHenryUrl(), url, payload,  i18n._("Error adding Key: "), function(err,data) {
        if (err) {
          return cb(err);
        }
        if (!params.json && data.status === "ok") {
          return cb(null, i18n._("User SSH Key added successfully"));
        }
        return cb(null, data);
      });
    });
  }
};