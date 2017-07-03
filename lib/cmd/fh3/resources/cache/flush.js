/* globals i18n */
var ini = require("../../../../utils/ini");

module.exports = {
  'desc' : i18n._('Resources across FeedHenry'),
  'examples' :
    [{
      cmd : 'fhc resources cache flush --env=<environment>',
      desc : i18n._('Flush the cache of the env=<environment>')
    }],
  'demand' : ['env'],
  'alias' : {
    'env':'e',
    0 : 'env'
  },
  'describe' : {
    'env' : i18n._('Environment ID which you want flush the cache')
  },
  'url' : function(argv) {
    var domain = ini.get("domain", "user");
    return "api/v2/resources/" + domain + "/" + argv.env + "/cache/flush";
  },
  'method' : 'post'
};