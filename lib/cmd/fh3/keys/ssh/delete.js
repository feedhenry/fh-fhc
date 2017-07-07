/* globals i18n */
var common = require('../../../../common.js');
var fhreq = require("../../../../utils/request");
var fhc = require("../../../../fhc");

module.exports = {
  'desc' : i18n._('Delete a SSH Key'),
  'examples' :
    [{
      cmd : 'fhc keys ssh delete --label=<label>',
      desc : i18n._("Delete the SSH Key with the <label>")
    }],
  'demand' : ['label'],
  'alias' : {
    'label': 'l',
    'json': 'j',
    0 : 'label'
  },
  'describe' : {
    'label' : i18n._("Label of the ssh key that you want delete."),
    'json' : i18n._("Output in json format")
  },
  'customCmd': function(params, cb) {
    var url = "box/srv/1.1/ide/" + fhc.curTarget + "/user/removeKey";
    common.doApiCall(fhreq.getFeedHenryUrl(), url, {name: params.label},  i18n._("Error deleting key: "), function(err,data) {
      if (err) {
        return cb(err);
      }
      if (!params.json && data.status === "ok") {
        return cb(null, i18n._("User SSH Key deleted successfully"));
      }
      return cb(null, data);
    });
  }
};