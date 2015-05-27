var fs = require('fs');

module.exports = {
  'desc' : 'Creates A New Theme.',
  'examples' : [{ cmd : 'fhc appforms themes create --themefile=<path to theme json file>', desc : 'Create A New Theme'}],
  'demand' : ['themefile'],
  'alias' : {},
  'describe' : {
    'themefile' : 'A Path To A File Containing A Valid JSON Definition Of A Theme'
  },
  'url' : '/api/v2/appforms/themes',
  'method' : 'post',
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
      return cb(err, themeJSON);
    });
  }
};
