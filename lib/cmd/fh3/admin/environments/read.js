module.exports = {
  'desc' : 'Read an environment by id',
  'examples' : [{ cmd : 'fhc admin environments read --id=<id> ', desc : 'Read an environment by id'}],
  'demand' : ['id'],
  'alias' : {},
  'describe' : {
    'id' : 'A unique identifier for an environment'
  },
  'url' : function(params){
    return '/api/v2/environments/' + params.id;
  },
  'method' : 'get'
};
