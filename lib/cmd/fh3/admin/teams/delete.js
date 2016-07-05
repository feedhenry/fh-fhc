/* globals i18n */
module.exports = {
  'desc' : i18n._('Delete a team.'),
  'examples' : [{ cmd : 'fhc admin teams delete --id=1a2b', desc : i18n._('Deletes team with id 1a2b')}],
  'demand' : ['id'],
  'alias' : {
    0 : 'id'
  },
  'describe' : {
    'id' : i18n._('Some unique identifier for your environment')
  },
  'url' : function(params){
    return '/api/v2/admin/teams/' + params.id;
  },
  'method' : 'delete'
};
