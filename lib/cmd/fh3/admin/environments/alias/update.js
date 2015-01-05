module.exports = { 
  'desc' : 'Update an environments.',
  'examples' : [{ cmd : 'fh admin-environment-aliases update --id=<environment alias id> [--environment=<environment id>] [--environmentAlias=<environment id alias>] [--environmentLabelAlias=<environment label alias>]', desc : 'Update an environment alias by id'}],
  'demand' : ['id'],
  'alias' : {},
  'describe' : {
    'id' : 'Some unique identifier for your environment alias - retrieve this from the list command',
    'environment' : 'The name for your environment this alias is targeting',
    'environmentAlias' : 'An aliased name for your environment',
    'environmentLabelAlias' : 'Description of your environment alias'
  },
  'url' : function(params){
    return '/api/v2/environmentaliases/' + params.environmentId;
  },
  'method' : 'put',
  'preCmd' : function(params, cb){
    return cb(null, {
      environmentIdAlias : params.environmentAlias,
      environmentId : params.id,
      environmentLabelAlias : params.environmentLabelAlias
    });
  }
};
