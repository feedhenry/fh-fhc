var fhreq = require('../../../../../utils/request.js');
var fs = require('fs');

module.exports = {
  'desc' : 'Export A Set Of Submissions A Zip File Contain CSV Files',
  'examples' : [{ cmd : 'fhc appforms environments submissions exportcsv --environment=<ID Of Environment To Export Submissions From> --fieldHeader=<name || fieldCode> --formId=<ID Of Form To Filter Submissions By> --projectId=<Project GUID To Filter Submissions By> --output=<File To Download Zip File To>.zip', desc : 'Export A Set Of Submissions A Zip File Contain CSV Files'}],
  'demand' : ['environment', 'output', 'fieldHeader'],
  'alias' : {},
  'describe' : {
    'environment': "ID Of Environment To Export Submissions From",
    'output': "File To Download Zip File To. Must Have A .zip Extension.",
    'fieldHeader': "Headers To Use In The Exported CSV Files. Can Either Be name or fieldCode",
    'formId': "ID Of Form To Filter Submissions By",
    'projectId': "Project GUID To Filter Submissions By"
  },
  'url' : function(params){
    return "/api/v2/mbaas/" + params.environment + "/appforms/submissions/export";
  },
  'customCmd': function(params, cb){
    //Custom commad to make a file request.
    params.url = this.url(params);
    params.method = this.method;

    if(params.output.indexOf(".zip") === -1){
      return cb("Expected The Output File To Have A .zip Extension");
    }

    fs.stat(params.output, function(err){
      if(!err){
        return cb("The file at path " + params.output + " already exists.");
      }

      fhreq.downloadFile(params, cb);
    });
  },
  'method' : 'post'
};
