
module.exports = {
  'desc' : 'Read A Single Form Project',
  'examples' : [{ cmd : 'fhc appforms apps read --id=<ID Of Form Project To Read>', desc : 'Read A Single Form Project'}],
  'demand' : ['id'],
  'alias' : {},
  'describe' : {
    'id': "GUID Of Form Project To Read"
  },
  'url' : function(params){
    return "/api/v2/appforms/apps/" + params.id;
  },
  'method' : 'get'
};
