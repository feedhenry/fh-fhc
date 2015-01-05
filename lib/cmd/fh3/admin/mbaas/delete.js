module.exports = { 
  'desc' : 'Delete an mBaaS.',
  'examples' : [{ cmd : 'fh admin mbaas delete --id=<mBaaS id>'}],
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
