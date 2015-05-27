var fs = require('fs');
var _ = require('underscore');

module.exports = {
  'desc' : 'Update A Single Theme.',
  'examples' : [{ cmd : 'fhc appforms themes update --id=<id of theme to update> --themefile=<path to theme json file>', desc : 'Update A Single Theme'}],
  'demand' : ['themefile', 'id'],
  'alias' : {},
  'describe' : {
    'id': 'ID Of The Theme To Update',
    'themefile' : 'A Path To A File Containing A Valid JSON Definition Of A Theme'
  },
  'url' : function(params){
    return "/api/v2/appforms/themes/" + params.id;
  },
  'method' : 'put',
  'preCmd' : function(params, cb){
    var themeFilePath = params.themefile;

    //Reading The File Passed For Theme Content
    fs.readFile(themeFilePath, function(err, themeFileContent){
      themeFileContent = themeFileContent || "";
      var themeJSON;
      try{
        themeJSON = JSON.parse(themeFileContent);
      } catch(e){
        return cb("Invalid Theme JSON Object");
      }

      //The POST Request Should Contain The Theme JSON Object
      return cb(err, _.extend(themeJSON, params));
    });
  }
};
