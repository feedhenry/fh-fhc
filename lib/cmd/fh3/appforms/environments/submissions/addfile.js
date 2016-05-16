/* globals i18n */
var fhreq = require('../../../../../utils/request.js');
var fs = require('fs');
var util = require('util');

module.exports = {
  'desc': i18n._('Add A Single File To A Submission'),
  'examples': [{
    cmd: 'fhc appforms environments submissions addfile --environment=<ID Of Environment The Submission Is Located In> --id=<Submission ID> --fieldid=<ID Of Field The File Is Being Added To>--fileid=<New ID For The File> --file=<Path To File To Upload>',
    desc: i18n._('Add A Single File To A Submission')
  }],
  'demand': ['environment', 'id', 'fieldid', 'fileid', 'file'],
  'alias': {},
  'describe': {
    'environment': i18n._("ID Of Environment The Submission Is Located In"),
    'id': i18n._("ID Of Submission Containing The File"),
    'fileid': i18n._("ID Of File To Upload"),
    'fieldid': i18n._("ID Of Field The File Is Being Added To"),
    'file': i18n._("Path To File To Upload")
  },
  'url': function (params) {
    return "/api/v2/mbaas/" + params.environment + "/appforms/submissions/" + params.id + "/fields/" + params.fieldid + "/files/" + params.fileid;
  },
  'customCmd': function (params, cb) {
    //Custom commad to make a file request, in this case, the returned file is a PDF.
    params.url = this.url(params);
    params.method = this.method;

    fs.stat(params.file, function (err, stats) {
      if (err) {
        return cb(util.format(i18n._("The file at path %s does not exist."), params.file));
      }

      if (!stats.isFile()) {
        return cb(util.format(i18n._("The file at path %s is not a file."), params.file));
      }

      fhreq.streamFileUpload(params, cb);
    });
  },
  'method': 'post'
};
