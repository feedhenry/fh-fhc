/* globals i18n */
var common = require('../../../../common.js');

module.exports = {
  'desc' : i18n._('Check a domain'),
  'examples' : [{
    cmd : 'fhc admin domains check --domain=<domain>',
    desc : i18n._('Check the domain')}],
  'demand' : ['domain'],
  'perm' : "cluster/reseller/customer:write",
  'alias' : {
    'domain':'d',
    'json':'j',
    0 : 'domain',
    1 : 'json'
  },
  'describe' : {
    'domain' : i18n._("Domain that you want check (E.g support.us)"),
    'json' : i18n._("Output in json format")
  },
  'url' : function(argv) {
    var domain = argv.domain;
    return "/box/api/domains/check?domain=" + domain;
  },
  'method' : 'get',
  'postCmd': function(params, cb) {
    params._table = common.createObjectTable(params);
    return cb(null, params);
  }
};
