// 2016-04-07: This command was temporarily disabled due to decision of not supporting mbaas deletion
// until the back-end implements all infrastructure operations required for properly disposing of an MBaaS
module.exports = {
  'desc' : 'Delete an MBaaS.',
  'examples' : [{ cmd : 'fhc admin mbaas delete --id=<MBaaS id>'}],
  'demand' : ['id'],
  'alias' : {},
  'describe' : {
    'id' : 'Some unique MBaaS identifier'
  },
  'url' : function(params){
    return '/api/v2/mbaases/' + params.id;
  },
  'method' : 'delete'
};
