/* globals i18n */

module.exports = {
  'desc' : i18n._('Delete A Single Theme.'),
  'examples' : [{ cmd : 'fhc appforms themes delete --id=<ID Of Theme To Delete>', desc : i18n._('Delete A Single Theme.')}],
  'demand' : ['id'],
  'alias' : {},
  'describe' : {
    'id' : i18n._('ID Of The Theme To Remove.')
  },
  'url' : function(params){
    return '/api/v2/appforms/themes/' + params.id;
  },
  'method' : 'delete'
};
