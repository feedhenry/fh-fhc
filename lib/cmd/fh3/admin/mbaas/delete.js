module.exports = {
  'desc' : 'Delete an MBaaS.',
  'examples' : [{ cmd : 'fhc admin mbaas delete --id=<MBaaS id>'}],
  'demand' : ['id'],
  'alias' : {},
  'describe' : {
    'id' : 'Some unique MBaaS identifier'
  },
  'url' : function(params) {
    return '/api/v2/mbaases/' + params.id;
  },
  'method' : 'delete'
};
