/* globals i18n */
var common = require('../../../../../common.js');
var fhreq = require("../../../../../utils/request");
var fhc = require("../../../../../fhc");

module.exports = {
  'desc' : i18n._('Update App Store Item Group.'),
  'examples' : [{
    cmd : 'fhc admin appstore itemgroups update --guid=<guid> --name=<name> --description=<description>',
    desc : i18n._('Update <name> and the <description> of the App Store Item Group with <guid>')
  }],
  'demand' : ['guid'],
  'alias' : {
    'guid':'g',
    'name':'n',
    'description':'d',
    'json':'j',
    0:'guid',
    1:'name',
    2:'description'
  },
  'describe' : {
    'guid' : i18n._("Unique 24 character GUID of the item group"),
    'name' : i18n._("Name of the item group"),
    'description' : i18n._("Description of the item group"),
    'json' : i18n._("Output in json format")
  },
  'customCmd': function(argv, cb) {
    fhc.admin.appstore.itemgroups.read({guid:argv.guid, json:true}, function(err,data) {
      if (err) {
        return cb(err);
      }
      data.description = argv.description || data.description;
      data.name = argv.name || data.name;
      common.doApiCall(fhreq.getFeedHenryUrl(), "/box/srv/1.1/admin/storeitemgroup/update", data, i18n._("Error updating group: "), function(err, data) {
        if (err) {
          return cb(err);
        }
        if (!argv.json) {
          var headers = ['GUID', 'Name', 'Description','Store Items','Users'];
          var fields = ['guid', 'name', 'description','storeitems','users'];
          data._table = common.createTableFromArray(headers, fields, [data]);
        }
        return cb(null, data);
      });
    });
  }
};