/* globals i18n */
var fs = require('fs');
var fhreq = require('../../../../utils/request.js');
var path = require('path');

module.exports = {
  'desc': i18n._('Export all the forms defined in a given domain. (Platform version >= 3.10.0 required.)'),
  'examples': [{
    cmd: 'fhc appforms forms export --file=<Output zip file>',
    desc: i18n._('Export all the forms contained in your domain to an output zip file.')
  }],
  'demand': ['file'],
  'alias': {},
  'describe': {
    'file': i18n._('Output zip file containing the forms export.')
  },
  'url': '/api/v2/appforms/forms/export',
  'method': 'get',
  'customCmd': function(params, cb) {

    params.url = this.url;
    params.method = this.method;
    params.output = params.file;

    if (path.extname(params.file) !== ".zip") {
      return cb(i18n._("Expected the output file to have a .zip extension"));
    }

    fs.stat(params.file, function(err) {
      if (!err) {
        return cb(i18n._("The file at path " + params.file + " already exists."));
      }

      fhreq.downloadFile(params, cb);
    });
  }
};
