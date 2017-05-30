/* globals i18n */
module.exports = {
  'desc' : i18n._('Read service'),
  'examples' :
  [{
    cmd : 'fhc services read --service=<service>',
    desc : i18n._('Read the <service>')
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
  'method' : 'get'
};