
module.exports = {
  'desc' : 'Delete A Single Theme.',
  'examples' : [{ cmd : 'fhc appforms themes delete --id=<ID Of Theme To Delete>', desc : 'Delete A Single Theme.'}],
  'demand' : ['id'],
  'alias' : {},
  'describe' : {
    'id' : 'ID Of The Theme To Remove.'
  },
  'url' : function(params){
    return '/api/v2/appforms/themes/' + params.id;
  },
  'method' : 'delete'
};
