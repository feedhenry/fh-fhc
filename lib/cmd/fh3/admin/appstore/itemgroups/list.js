/* globals i18n */
var common = require('../../../../../common.js');
var _ = require('underscore');
var util = require('util');

module.exports = {
  'desc' : i18n._('List App Store Item Groups.'),
  'examples' : [{
    cmd : 'fhc admin appstore itemgroups list',
    desc : i18n._('List all Item Groups which are into App Store')
  },
  {
    cmd : 'fhc admin appstore itemgroups list --name=<name>',
    desc : i18n._('List all Item Groups which are into App Store and filter by <name>')
  }],
  'demand' : [],
  'alias' : {
    'name':'n',
    'json':'j',
    0: 'name'
  },
  'describe' : {
    'name' : i18n._("Name of the App Store Item Groups"),
    'json' : i18n._("Output in json format")
  },
  'url' : "/box/srv/1.1/admin/storeitemgroup/list",
  'method' : 'get',
  'postCmd': function(argv, response, cb) {
    if (argv.name) {
      response.list = filterByName(argv, response.list);
    }
    if (!argv.json) {
      if (argv.name && response.list.length < 1) {
        return cb(util.format(i18n._("Not found Item Groups with the name '%s' ."), argv.name));
      }
      if (response.list) {
        var headers = ['GUID', 'Name', 'Description'];
        var fields = ['guid', 'name', 'description'];
        response._table = common.createTableFromArray(headers, fields, response.list);
      } else {
        return cb(null,i18n._("Not found Item Groups for the AppStore of this domain"));
      }

    }
    return cb(null, response);
  }
};

/**
 * Filter the results by the name of the Item Group
 * @param params
 * @param groups
 */
function filterByName(params, groups) {
  return _.filter(groups, function(item) {
    return item.name.toUpperCase().indexOf(params.name.toUpperCase()) === 0;
  });
}