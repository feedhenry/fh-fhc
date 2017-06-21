/* globals i18n */
var common = require("../../common");
module.exports = {
  'desc' : i18n._('Lists build artifacts of an application'),
  'examples' : [{
    cmd : 'fhc artifacts --app=<app-id>',
    desc : i18n._('Lists build artifacts of the <app-id>')}],
  'demand' : ['app'],
  'alias' : {
    'app':'a',
    0 : 'app'
  },
  'describe' : {
    'app' : i18n._("Unique 24 character GUID of your client application.")
  },
  'url' : function(argv) {
    return 'box/srv/1.1/artifacts?isBuild=true&appId=' + argv.app;
  },
  'method' : 'get',
  'postCmd': function(argv, params, cb) {
    if (!argv.json) {
      var headers = ['Platform', 'App Version', 'Date', 'Type', 'Credential', 'Url'];
      var fields = ['destination', 'appVersion', 'sysModified', 'type', 'credential', 'otaurl'];
      params._table = common.createTableFromArray(headers, fields, params);
    }
    return cb(null, params);

  }
};
