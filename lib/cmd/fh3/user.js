/* globals i18n */
var ini = require("../../utils/ini");

module.exports = {
  'desc' : i18n._('User information'),
  'examples' :
    [{
      cmd : 'fhc user',
      desc : i18n._('Show the information of the logged user into the target domain')
    },{
      cmd : 'fhc user --json',
      desc : i18n._('Show the information of the logged user into the target domain in the json format')
    },{
      cmd : 'fhc user --domain=<domain>',
      desc : i18n._('Show the information of the logged user into the <domain>')
    }],
  'demand' : [],
  'alias' : {
    'domain' : 'd',
    'json' : 'j',
    0 : 'domain'
  },
  'describe' : {
    'json' : i18n._('Output into json format')
  },
  'url' : function(argv) {
    var domain;
    if (!argv.domain) {
      domain =  ini.get('domain', 'user');
    }
    return "box/srv/1.1/ide/" + domain + "/user/read";
  },
  'method' : 'get',
  'postCmd' : function(response,cb) {
    if (response.status === 'error' && response.msg && response.msg[0] && response.msg[0].indexOf('Operation not permitted') !== -1) {
      return cb(null,  i18n._("Not logged in"));
    } else {
      response._table = response.userName + " [" + response.email + "]";
    }
    return cb(null, response);
  }
};
