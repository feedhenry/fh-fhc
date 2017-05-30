/* globals i18n */
var util = require('util');

module.exports = {
  'desc' : i18n._('Delete service'),
  'examples' :
  [{
    cmd : 'fhc services delete --service=<service>',
    desc : i18n._('Delete the <service>')
  }],
  'demand' : ['service'],
  'alias' : {
    'service':'s',
    0 : 'service'
  },
  'describe' : {
    'service' : i18n._('Unique 24 character GUID of the service')
  },
  'url' : function(argv) {
    return "box/api/connectors/" + argv.service ;
  },
  'method' : 'delete',
  'postCmd': function(params, cb) {
    if ( params ) {
      return cb(null, util.format(i18n._("Service '%s' delete successfully"), params.title));
    }
  }
};