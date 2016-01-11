var fhreq = require('../../../../../utils/request.js');
var fs = require('fs');

module.exports = {
  'desc': 'Export A Single Submission As A PDF File',
  'examples': [{
    cmd: 'fhc appforms environments submissions exportpdf --environment=<ID Of Environment The Submission Is Located In> --id=<Submission ID> --output=<File To Download Submission To>.pdf',
    desc: 'Export A Single Submission As A PDF File'
  }],
  'demand': ['environment', 'id', 'output'],
  'alias': {},
  'describe': {
    'environment': "ID Of Environment The Submission Is Located In",
    'id': "ID Of Submission To Export",
    'output': "Path To File To Export Submission To. Must Have A .pdf Extension."
  },
  'url': function (params) {
    return "/api/v2/mbaas/" + params.environment + "/appforms/submissions/" + params.id + "/exportpdf";
  },
  'customCmd': function (params, cb) {
    //Custom commad to make a file request.
    params.url = this.url(params);
    params.method = this.method;

    if (params.output.indexOf(".pdf") === -1) {
      return cb("Expected The Output File To Have A .pdf Extension");
    }

    fs.stat(params.output, function (err) {
      if (!err) {
        return cb("The file at path " + params.output + " already exists.");
      }

      fhreq.downloadFile(params, cb);
    });
  },
  'method': 'get'
};
