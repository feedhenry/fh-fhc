/* globals i18n */
module.exports = {
  'desc' : i18n._('Clones An Existing Theme'),
  'examples' : [{ cmd : 'fhc appforms themes clone --id=<ID Of Theme To Clone>', desc : i18n._('Clones An Existing Theme')}],
  'demand' : ['id'],
  'alias' : {},
  'describe' : {
    'id' : i18n._('ID Of Theme To Clone')
  },
  'url' : function(params){
    return '/api/v2/appforms/themes/' + params.id + "/clone";
  },
  'method' : 'post'
};
