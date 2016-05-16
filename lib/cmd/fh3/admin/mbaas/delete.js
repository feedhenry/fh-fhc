/* globals i18n */
module.exports = {
  'desc' : i18n._('Delete an MBaaS.'),
  'examples' : [{ cmd : 'fhc admin mbaas delete --id=<MBaaS id>'}],
  'demand' : ['id'],
  'alias' : {},
  'describe' : {
    'id' : i18n._('Some unique MBaaS identifier')
  },
  'url' : function(params) {
    return '/api/v2/mbaases/' + params.id;
  },
  'method' : 'delete'
};
