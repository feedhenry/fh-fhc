var fs = require('fs');
var _ = require('underscore');

module.exports = {
  'desc' : 'Create A New Submission',
  'examples' : [{ cmd : 'fhc appforms environments submissions create --environment=<Environment Id> --submissiondata=<Path To JSON Submission Data> --projectid=<project to associate the submission with>', desc : 'Create A New Submission'}],
  'demand' : ['environment', 'submissiondata'],
  'alias' : {},
  'describe' : {
    'environment': "Environment Id",
    'submissiondata': "Path To JSON Submission Data",
    'projectid': "Project Guid To Associate The Submission With"
  },
  'url' : function(params){
    return "/api/v2/mbaas/" + params.environment + "/appforms/submissions";
  },
  'preCmd' : function(params, cb){
    var submissionDataPath = params.submissiondata;

    //Reading The File Passed For Form Content
    fs.readFile(submissionDataPath, function(err, submissionFileContent){
      if(err){
        return cb("Error Reading File At " + submissionDataPath + " : " + err.code);
      }
      submissionFileContent = submissionFileContent || "";
      var submissionJSON;
      try{
        submissionJSON = JSON.parse(submissionFileContent);
      } catch(e){
        return cb("Invalid Submission JSON Object");
      }

      //If the user supplies a project id, then assign it to the submission JSON data
      if(params.projectid){
        submissionJSON.appId = params.projectid
      }

      //The POST Request Should Contain The Form JSON Object
      return cb(err, _.extend(submissionJSON, params));
    });
  },
  'method' : 'post'
};
