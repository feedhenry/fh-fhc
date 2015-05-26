
module.exports = {
  'desc' : 'Read A Single Theme.',
  'examples' : [{ cmd : 'fhc appforms themes read --id=<ID Of Theme To Read>', desc : 'Read A Single Theme'}],
  'demand' : ['id'],
  'alias' : {},
  'describe' : {
    'id': "ID Of Theme To Read"
  },
  'url' : function(params){
    return "/api/v2/appforms/themes/" + params.id;
  },
  'method' : 'get'
};
