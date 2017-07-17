/* globals i18n */
var common = require('../../../../../common.js');
var fhreq = require("../../../../../utils/request");

module.exports = {
  'desc' : i18n._('Create App Store Item Group.'),
  'examples' : [{
    cmd : 'fhc admin appstore itemgroups create --name=<name> --description=<description>',
    desc : i18n._('Create App Store Item Group with the <name> and <description>')
  }],
  'demand' : ['name','description'],
  'alias' : {
    'name':'n',
    'description':'d',
    'json':'j',
    0:'name',
    1:'description'
  },
  'describe' : {
    'name' : i18n._("Name of the item group"),
    'description' : i18n._("Description of the item group"),
    'json' : i18n._("Output in json format")
  },
  'customCmd': function(argv, cb) {
    common.doApiCall(fhreq.getFeedHenryUrl(), "/box/srv/1.1/admin/storeitemgroup/create", {
      "name": argv.name,
      "description": argv.description
    }, i18n._("Error creating group: "), function(err, data) {
      if (err) {
        return cb(err);
      }
      if (!argv.json) {
        var headers = ['GUID', 'Name', 'Description','Store Items','Users'];
        var fields = ['guid', 'name', 'description','storeitems','users'];
        data._table = common.createTableFromArray(headers, fields, [data]);
      }
      return cb(undefined, data);
    });
  }
};