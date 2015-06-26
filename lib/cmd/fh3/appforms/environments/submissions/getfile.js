var fhreq = require('../../../../../utils/request.js');
var fs = require('fs');

module.exports = {
  'desc' : 'Read A Single Submission File',
  'examples' : [{ cmd : 'fhc appforms environments submissions getfile --environment=<ID Of Environment The Submission Is Located In> --id=<Submission ID> --fileid=<ID Of File To Download> --output=<Path To Output File>', desc : 'Download A Single Submission File'}],
  'demand' : ['environment', 'id', 'fileid', 'output'],
  'alias' : {},
  'describe' : {
    'environment': "ID Of Environment The Submission Is Located In",
    'id': "ID Of Submission Containing The File",
    'fileid': "ID Of File To Download",
    'output': "Path To Output Downloaded File To"
  },
  'url' : function(params){
    return "/api/v2/mbaas/" + params.environment + "/appforms/submissions/" + params.id + "/files/" + params.fileid;
  },
  'customCmd': function(params, cb){
    //Custom commad to make a file request, in this case, the returned file is a PDF.
    params.url = this.url(params);
    params.method = this.method;

    fs.stat(params.output, function(err){
      if(!err){
        return cb("The file at path " + params.output + " already exists.");
      }

      fhreq.downloadFile(params, cb);
    });
  },
  'method' : 'get'
};
