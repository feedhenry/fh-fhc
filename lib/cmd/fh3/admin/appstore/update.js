/* globals i18n */

var fhreq = require("../../../../utils/request");
var common = require("../../../../common");

module.exports = {
  'desc' : i18n._('Update App Store'),
  'examples' : [{
    cmd : 'fhc admin appstore update --name=<name> --description=<description> --apps=<apps>',
    desc : i18n._('Update <name> and/or <description> and/or the <apps> of the App Store')
  }],
  'demand' : [],
  'alias' : {
    'name' : 'n',
    'description' : 'd',
    'apps' : 'a',
    'json' : 'j',
    0 :'name',
    1 :'description',
    2 :'apps'
  },
  'describe' : {
    'name' : i18n._("Name of the App Store"),
    'description' : i18n._("Descriptions of the App Store"),
    'apps' : i18n._("List of the Unique 24 character GUIDs of the applications of this AppStore'"),
    'json' : i18n._('Output into json format')
  },
  'customCmd': function(params, cb) {
    var payload = {};
    if (params.apps) {
      payload["items"] = params.apps.split(",");
    }
    if (params.name) {
      payload["name"] = params.name;
    }
    if (params.description) {
      payload["description"] = params.description;
    }
    common.doApiCall(fhreq.getFeedHenryUrl(), "/box/srv/1.1/admin/appstore/update", payload, i18n._("Error updating item: "), function(err, data) {
      if (err) {
        return cb(err);
      }
      if (!params.json) {
        return cb(null, i18n._('App Store updated successfully.'));
      }
      return cb(null, data);
    });
  }
};
