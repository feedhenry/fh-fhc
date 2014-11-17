module.exports = { 
  'desc' : 'Delete a team.',
  'examples' : [{ cmd : 'fhc admin teams delete --id=<team id>', desc : 'Delete an environment by id'}],
  'demand' : ['id'],
  'alias' : {
    0 : 'id'
  },
  'describe' : {
    'id' : 'Some unique identifier for your environment'
  },
  'url' : function(params){
    return '/api/v2/admin/teams/' + params.id;
  },
  'method' : 'delete'
};
