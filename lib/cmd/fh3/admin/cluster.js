module.exports = {
  'desc' : 'read a cluster.',
  'examples' : [{ cmd : 'fhc admin admin cluster ', desc : 'read a cluster'}],
  'demand' : [],
  'alias' : {},
  'describe' : {
  },
  'url' : function(params){
    return '/box/api/clusters?tree=true'
  },
  'method' : 'get'
};
