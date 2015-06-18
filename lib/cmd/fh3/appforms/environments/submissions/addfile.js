var fhreq = require('../../../../../utils/request.js');
var fs = require('fs');

module.exports = {
  'desc' : 'Add A Single File To A Submission',
  'examples' : [{ cmd : 'fhc appforms environments submissions addfile --environment=<ID Of Environment The Submission Is Located In> --id=<Submission ID> --fieldid=<ID Of Field The File Is Being Added To>--fileid=<New ID For The File> --file=<Path To File To Upload>', desc : 'Add A Single File To A Submission'}],
  'demand' : ['environment', 'id', 'fieldid', 'fileid', 'file'],
  'alias' : {},
  'describe' : {
    'environment': "ID Of Environment The Submission Is Located In",
    'id': "ID Of Submission Containing The File",
    'fileid': "ID Of File To Upload",
    'fieldid': "ID Of Field The File Is Being Added To",
    'file': "Path To File To Upload"
  },
  'url' : function(params){
    return "/api/v2/mbaas/" + params.environment + "/appforms/submissions/" + params.id + "/fields/" + params.fieldid + "/files/" + params.fileid;
  },
  'customCmd': function(params, cb){
    //Custom commad to make a file request, in this case, the returned file is a PDF.
    params.url = this.url(params);
    params.method = this.method;

    fs.exists(params.file, function(exists){
      if(!exists){
        return cb("The file at path " + params.output + " does not exist.");
      }

      fhreq.streamFileUpload(params, cb);
    });
  },
  'method' : 'post'
};
