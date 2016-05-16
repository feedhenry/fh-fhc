/* globals i18n */
var fhreq = require('../../../../../utils/request.js');
var fs = require('fs');
var util = require('util');

module.exports = {
  'desc': i18n._('Export A Single Submission As A PDF File'),
  'examples': [{
    cmd: 'fhc appforms environments submissions exportpdf --environment=<ID Of Environment The Submission Is Located In> --id=<Submission ID> --output=<File To Download Submission To>.pdf',
    desc: i18n._('Export A Single Submission As A PDF File')
  }],
  'demand': ['environment', 'id', 'output'],
  'alias': {},
  'describe': {
    'environment': i18n._("ID Of Environment The Submission Is Located In"),
    'id': i18n._("ID Of Submission To Export"),
    'output': i18n._("Path To File To Export Submission To. Must Have A .pdf Extension.")
  },
  'url': function (params) {
    return "/api/v2/mbaas/" + params.environment + "/appforms/submissions/" + params.id + "/exportpdf";
  },
  'customCmd': function (params, cb) {
    //Custom commad to make a file request.
    params.url = this.url(params);
    params.method = this.method;

    if (params.output.indexOf(".pdf") === -1) {
      return cb(i18n._("Expected The Output File To Have A .pdf Extension"));
    }

    fs.stat(params.output, function (err) {
      if (!err) {
        return cb(util.format(i18n._("The file at path %s already exists."), params.output));
      }

      fhreq.downloadFile(params, cb);
    });
  },
  'method': 'get'
};
