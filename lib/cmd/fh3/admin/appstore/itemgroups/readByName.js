/* globals i18n */
var fhc = require("../../../../../fhc");
var util = require('util');

module.exports = {
  'desc' : i18n._('Read App Store Item Group.'),
  'examples' : [{
    cmd : 'fhc admin appstore itemgroups readByName --name=<name>',
    desc : i18n._('Read App Store Item Group with <name>')
  }],
  'demand' : ['name'],
  'alias' : {
    'name':'n',
    'json':'j',
    0:'name'
  },
  'describe' : {
    'name' : i18n._("Name of the item group"),
    'json' : i18n._("Output in json format")
  },
  'customCmd': function(argv, cb) {
    fhc.admin.appstore.itemgroups.list({name:argv.name,json:true}, function(err,data) {
      if (err) {
        return cb(err);
      }
      if (data && data.list && data.list[0] && data.list[0].guid) {
        fhc.admin.appstore.itemgroups.read({guid:data.list[0].guid, json:argv.json}, function(err,data) {
          if (err) {
            return cb(err);
          }
          return cb(null,data);
        });
      } else {
        return cb(null,util.format(i18n._("Not found Item Groups with the name '%s' ."), argv.name));
      }
    });
  }
};