module.exports = { 
  'desc' : 'Read an environment alias by id',
  'examples' : [{ cmd : 'fhc admin environments aliases read --id=<id> ', desc : 'Read an environment alias by id'}],
  'demand' : ['id'],
  'alias' : {},
  'describe' : {
    'id' : 'A unique identifier for an environment'
  },
  'url' : function(params){
    return '/api/v2/environmentaliases/' + params.id;
  },
  'method' : 'get',
};
