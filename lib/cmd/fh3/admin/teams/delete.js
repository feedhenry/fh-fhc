module.exports = { 
  'desc' : 'Delete a team.',
  'examples' : [{ cmd : 'fh admin teams delete --id=1a2b', desc : 'Deletes team with id 1a2b'}],
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
