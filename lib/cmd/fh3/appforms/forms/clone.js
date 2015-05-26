module.exports = {
  'desc' : 'Clones An Existing Form',
  'examples' : [{ cmd : 'fhc appforms forms clone --id=<ID Of Form To Clone>', desc : 'Clones An Existing Form'}],
  'demand' : ['id'],
  'alias' : {},
  'describe' : {
    'id' : 'ID Of Form To Clone'
  },
  'url' : function(params){
    return '/api/v2/appforms/forms/' + params.id + "/clone";
  },
  'method' : 'post'
};
