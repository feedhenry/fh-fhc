/* globals i18n */
module.exports = {
  'desc' : i18n._('Read an environment by id'),
  'examples' : [{ cmd : 'fhc admin environments read --id=<id> ', desc : i18n._('Read an environment by id')}],
  'demand' : ['id'],
  'alias' : {},
  'describe' : {
    'id' : i18n._('A unique identifier for an environment')
  },
  'url' : function(params) {
    return '/api/v2/environments/' + params.id;
  },
  'method' : 'get'
};
