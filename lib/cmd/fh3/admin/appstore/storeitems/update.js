/* globals i18n */

var fhreq = require("../../../../../utils/request");
var common = require("../../../../../common");

module.exports = {
  'desc' : i18n._('Update store item into AppStore'),
  'examples' : [{
    cmd : 'fhc admin appstore storeitems update --id=<id> --name=<name> --description=<description> --authToken=<authToken> --restrictToGroups=<true|false>',
    desc : i18n._('Update the <name>, <description>, <authpolicies>, <restrictToGroups> of the item store with <id>')
  }],
  'demand' : ['id','name'],
  'alias' : {
    'id' : 'i',
    'name' : 'n',
    'description' : 'd',
    'authToken' : 'a',
    'restrictToGroups' : 'r',
    'json' : 'j',
    0 :'id',
    1 :'name',
    2 :'description',
    3 :'authToken',
    4 :'restrictToGroups'
  },
  'describe' : {
    'id' : i18n._("Unique 24 character GUID of the store item."),
    'name' : i18n._("Name of the store item."),
    'description' : i18n._("Description of the store item."),
    'authToken' : i18n._("[DEPRECATED] AuthToken of the store item."),
    'restrictToGroups' : i18n._("Boolean to define that the item store will be restrict to groups"),
    'json' : i18n._('Output into json format')
  },
  'customCmd': function(params, cb) {
    var payload = {guid: params.id, name:params.name};
    payload.restrictToGroups = false;
    if (params.description) {
      payload.description = params.description;
    }
    if (params.authToken) {
      payload.authToken = params.authToken;
    }
    if (params.restrictToGroups) {
      payload.restrictToGroups = params.restrictToGroups;
    }
    common.doApiCall(fhreq.getFeedHenryUrl(), "/box/srv/1.1/admin/storeitem/update", payload , i18n._("Error updating storeitem: "), function(err, data) {
      if (err) {
        return cb(err);
      }
      if (!params.json && data.status === "ok") {
        return cb(null, i18n._('Store Item update successfully.'));
      }
      return cb(null, data);
    });
  }
};