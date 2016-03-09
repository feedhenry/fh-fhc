module.exports = {
  'desc' : 'Delete an environments.',
  'examples' : [{ cmd : 'fhc admin environments delete --id=<environment id>', desc : 'Delete an environment by id'}],
  'demand' : ['id'],
  'alias' : {},
  'describe' : {
    'id' : 'Some unique identifier for your environment'
  },
  'url' : function(params){
    return '/api/v2/environments/' + params.id;
  },
  'method' : 'delete'
};
