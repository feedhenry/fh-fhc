var fs = require('fs');
var _ = require('underscore');

module.exports = {
  'desc' : 'Update An Existing Submission',
  'examples' : [{ cmd : 'fhc appforms environments submissions update --environment=<Environment Id> --id=<Submission ID> --submissiondata=<Path To JSON Submission Data> ', desc : 'Update An Existing Submission'}],
  'demand' : ['environment', 'id', 'submissiondata'],
  'alias' : {},
  'describe' : {
    'environment': "Environment Id",
    'submissiondata': "Path To JSON Submission Data",
    'id': "Submission ID"
  },
  'url' : function(params){
    return "/api/v2/mbaas/" + params.environment + "/appforms/submissions/" + params.id;
  },
  'preCmd' : function(params, cb){
    var submissionDataPath = params.submissiondata;

    //Reading The File Passed For Form Content
    fs.readFile(submissionDataPath, function(err, submissionFileContent){
      submissionFileContent = submissionFileContent || "";
      var submissionJSON;
      try{
        submissionJSON = JSON.parse(submissionFileContent);
      } catch(e){
        return cb("Invalid Submission JSON Object");
      }

      //The POST Request Should Contain The Form JSON Object
      return cb(err, _.extend(submissionJSON, params));
    });
  },
  'method' : 'put'
};
