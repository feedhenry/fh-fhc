var fs = require('fs');

module.exports = {
  'desc' : 'Creates A New Form.',
  'examples' : [{ cmd : 'fhc appforms forms create --formfile=<path to form json file>', desc : 'Creates A New Form'}],
  'demand' : ['formfile'],
  'alias' : {},
  'describe' : {
    'formfile' : 'A Path To A File Containing A Valid JSON Definition Of A Form'
  },
  'url' : '/api/v2/appforms/forms',
  'method' : 'post',
  'preCmd' : function(params, cb){
    var formFilePath = params.formfile;
    //Reading The File Passed For Form Content
    fs.readFile(formFilePath, function(err, formFileContent){
      formFileContent = formFileContent || "";
      var formJSON;
      try{
        formJSON = JSON.parse(formFileContent);
      } catch(e){
        return cb("Invalid Form JSON Object");
      }

      //The POST Request Should Contain The Form JSON Object
      return cb(err, formJSON);
    });
  }
};
