/* globals i18n */
var fhreq = require('../../../../../utils/request.js');
var fs = require('fs');
var util = require('util');

module.exports = {
  'desc': i18n._('Read A Single Submission File'),
  'examples': [{
    cmd: 'fhc appforms environments submissions getfile --environment=<ID Of Environment The Submission Is Located In> --id=<Submission ID> --fileid=<ID Of File To Download> --output=<Path To Output File>',
    desc: i18n._('Download A Single Submission File')
  }],
  'demand': ['environment', 'id', 'fileid', 'output'],
  'alias': {},
  'describe': {
    'environment': i18n._("ID Of Environment The Submission Is Located In"),
    'id': i18n._("ID Of Submission Containing The File"),
    'fileid': i18n._("ID Of File To Download"),
    'output': i18n._("Path To Output Downloaded File To")
  },
  'url': function (params) {
    return "/api/v2/mbaas/" + params.environment + "/appforms/submissions/" + params.id + "/files/" + params.fileid;
  },
  'customCmd': function (params, cb) {
    //Custom commad to make a file request, in this case, the returned file is a PDF.
    params.url = this.url(params);
    params.method = this.method;

    fs.stat(params.output, function (err) {
      if (!err) {
        return cb(util.format(i18n._("The file at path %s already exists."), params.output));
      }

      fhreq.downloadFile(params, cb);
    });
  },
  'method': 'get'
};
