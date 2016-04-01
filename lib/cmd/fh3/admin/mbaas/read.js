/* globals i18n */
module.exports = {
  'desc' : i18n._('Read an MBaaS.'),
  'examples' : [{ cmd : 'fhc admin mbaas read --id=<MBaaS id>'}],
  'demand' : ['id'],
  'alias' : {},
  'describe' : {
    'id' : i18n._('Some unique MBaaS identifier')
  },
  'url' : function(params){
    return '/api/v2/mbaases/' + params.id;
  },
  'method' : 'get'
};
