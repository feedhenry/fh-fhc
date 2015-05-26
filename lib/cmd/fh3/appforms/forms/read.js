
module.exports = {
  'desc' : 'Read A Single Form.',
  'examples' : [{ cmd : 'fhc appforms forms read --id=<ID Of Form To Read>', desc : 'Read A Single Form'}],
  'demand' : ['id'],
  'alias' : {},
  'describe' : {
    'id': "ID Of Form To Read"
  },
  'url' : function(params){
    return "/api/v2/appforms/forms/" + params.id;
  },
  'method' : 'get'
};
