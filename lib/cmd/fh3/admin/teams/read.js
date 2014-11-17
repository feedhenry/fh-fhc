module.exports = { 
  'desc' : 'Read a team by id',
  'examples' : [{ cmd : 'fhc admin teams read --id=<id> ', desc : 'Read a team by id'}],
  'demand' : ['id'],
  'alias' : {
    0 : 'id'
  },
  'describe' : {
    'id' : 'A unique identifier for an environment'
  },
  'url' : function(params){
    return "api/v2/admin/teams/" + params.id;
  },
  'method' : 'get'
};
