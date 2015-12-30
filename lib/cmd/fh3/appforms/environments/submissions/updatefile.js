var fhreq = require('../../../../../utils/request.js');
var fs = require('fs');

module.exports = {
  'desc': 'Update A Single File In A Submission',
  'examples': [{
    cmd: 'fhc appforms environments submissions updatefile --environment=<ID Of Environment The Submission Is Located In> --id=<Submission ID> --fieldid=<ID Of Field The File Is Being Updated To>--fileid=<ID Of File To Update> --file=<Path To File To Upload>',
    desc: 'Update A Single File In A Submission'
  }],
  'demand': ['environment', 'id', 'fieldid', 'fileid', 'file'],
  'alias': {},
  'describe': {
    'environment': "ID Of Environment The Submission Is Located In",
    'id': "ID Of Submission Containing The File",
    'fileid': "ID Of File To Upload",
    'fieldid': "ID Of Field The File Is Being Added To",
    'file': "Path To File To Upload"
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
        return cb("The file at path " + params.file + " does not exist.");
      }

      if (!stats.isFile()) {
        return cb("The file at path " + params.file + " is not a file.");
      }

      fhreq.streamFileUpload(params, cb);
    });
  },
  'method': 'put'
};
