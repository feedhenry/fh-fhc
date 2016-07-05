/* globals i18n */
module.exports = {
  'desc' : i18n._('Delete an environment'),
  'examples' : [{ cmd : 'fhc admin environments delete --id=<environment id>', desc : i18n._('Delete an environment by id')}],
  'demand' : ['id'],
  'alias' : {},
  'describe' : {
    'id' : i18n._('Some unique identifier for your environment')
  },
  'url' : function(params) {
    return '/api/v2/environments/' + params.id;
  },
  'method' : 'delete'
};
