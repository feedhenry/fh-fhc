module.exports = {
  'desc' : 'Delete an environment alias.',
  'examples' : [{ cmd : 'fhc admin environments alias delete --id=<environment alias id>', desc : 'Delete an environment alias by id'}],
  'demand' : ['id'],
  'alias' : {},
  'describe' : {
    'id' : 'Some unique identifier for your environment alias'
  },
  'url' : function(params){
    return '/api/v2/environmentaliases/' + params.id;
  },
  'method' : 'delete'
};
