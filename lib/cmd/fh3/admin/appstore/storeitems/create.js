/* globals i18n */

var fhreq = require("../../../../../utils/request");
var common = require("../../../../../common");

module.exports = {
  'desc' : i18n._('Create store item into AppStore'),
  'examples' : [{
    cmd : 'fhc admin appstore storeitems create --name=<name> --description=<description> --authToken=<authToken> --restrictToGroups=<true|false>',
    desc : i18n._('Create store item with <name>, <description>, <authpolicies>, <restrictToGroups>')
  }],
  'demand' : ['name'],
  'alias' : {
    'name' : 'n',
    'description' : 'd',
    'authToken' : 'a',
    'restrictToGroups' : 'r',
    'json' : 'j',
    0 :'name',
    1 :'description',
    2 :'authToken',
    3 :'restrictToGroups'
  },
  'describe' : {
    'name' : i18n._("Name of the store item."),
    'description' : i18n._("Description of the store item."),
    'authToken' : i18n._("AuthToken of the store item."),
    'restrictToGroups' : i18n._("Defaul value is false. Boolean to define that the item store will be restrict to groups"),
    'json' : i18n._('Output into json format')
  },
  'customCmd': function(params, cb) {
    var payload = {name: params.name};
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
    common.doApiCall(fhreq.getFeedHenryUrl(), "/box/srv/1.1/admin/storeitem/create", payload , i18n._("Error creating storeitem: "), function(err, data) {
      if (err) {
        return cb(err);
      }
      if (!params.json && data.status === "ok") {
        return cb(null, i18n._('Store Item created successfully.'));
      }
      return cb(null, data);
    });
  }
};