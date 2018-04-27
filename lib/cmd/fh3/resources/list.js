/* globals i18n */
var fhc = require("../../../fhc");

module.exports = {
  'desc' : i18n._('List Resources across RHMAP'),
  'examples' :
    [{
      cmd : 'fhc resources list',
      desc : i18n._('List of all resources of this domain')
    }],
  'demand' : ['env'],
  'alias' : {
    'env' : 'e',
    0 : 'env'
  },
  'describe' : {},
  'url' : function(argv) {
    return "api/v2/resources/" + fhc.curTarget + "/" + argv.env ;
  },
  'method' : 'get'
};