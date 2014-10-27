module.exports = { 
  'usage' : 'Delete an mBaaS.',
  'examples' : [{ cmd : 'fhc admin mbaas delete --id=<mBaaS id>'}],
  'demand' : ['id'],
  'alias' : {},
  'describe' : {
    'id' : 'Some unique mBaaS identifier'
  },
  'url' : function(params){
    return '/api/v2/mbaases/' + params.id;
  },
  'method' : 'delete',
};
