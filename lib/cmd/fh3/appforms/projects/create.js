var fs = require('fs');
var _ = require('underscore');

module.exports = {
  'desc' : 'Create A Single Form Project.',
  'examples' : [{ cmd : 'fhc appforms apps create --id=<GUID Of Project To Associate With Forms> --theme=<ID Of Theme To Associate With The Project> --forms=<formId1>,<formId2>', desc : 'Create A Single Form Project'}],
  'demand' : ['id', 'forms', 'theme'],
  'alias' : {},
  'describe' : {
    'id': 'GUID Of The Form Project To Create',
    'theme' : 'The ID Of The Theme To Associate With The Form Project',
    'forms' : 'Comma-separated List Of Form IDs To Associate With The Form Project'
  },
  'url' : function(params){
    return "/api/v2/appforms/apps/" + params.id;
  },
  'method' : 'put',
  'preCmd' : function(params, cb){

    var theme = params.theme;
    var forms = params.forms || "";

    forms = forms.split(',');
    forms = _.compact(forms);

    var dataObject = {
      id: params.id,
      forms: forms
    };

    if(theme){
      dataObject.theme = params.theme;
    }

    return cb(undefined, dataObject);

  }
};
