module.exports = {
  'desc' : 'Read an MBaaS.',
  'examples' : [{ cmd : 'fhc admin mbaas read --id=<MBaaS id>'}],
  'demand' : ['id'],
  'alias' : {},
  'describe' : {
    'id' : 'Some unique MBaaS identifier'
  },
  'url' : function(params){
    return '/api/v2/mbaases/' + params.id;
  },
  'method' : 'get'
};
