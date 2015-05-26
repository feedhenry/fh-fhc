
module.exports = {
  'desc' : 'Copy A Form Definition From An Environment To Master Copy.',
  'examples' : [{ cmd : 'fhc appforms environments forms copy_to_core --id=<ID Of Form To Copy Back> --environment=<ID Of Environment To Copy Form From>', desc : 'Copy A Form Definition From An Environment To Master Copy.'}],
  'demand' : ['environment', 'id'],
  'alias' : {},
  'describe' : {
    'id': "ID Of Form To Update",
    'environment': "ID Of Environment To Copy Form From"
  },
  'url' : function(params){
    return "/api/v2/mbaas/" + params.environment + "/appforms/forms/" + params.id + "/copy_to_core";
  },
  'method' : 'post'
};