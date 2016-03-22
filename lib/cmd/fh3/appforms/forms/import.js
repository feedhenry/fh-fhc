var url = '/api/v2/appforms/forms/import';
var upload = require('../../../../utils/request').formsImportZipFileUpload;

module.exports = {
  'desc': 'Imports a zip file containing definitions for multiple forms, intended to be used with *export*',
  'examples': [{cmd: 'fhc appforms forms import --file=<path to zip file>', desc: 'Imports forms contained in the zip file'}],
  'demand': ['file'],
  'alias': {},
  'describe': {
    'file': 'Path to a file'
  },
  'url': url,
  'method': 'post',
  'customCmd': function(params, cb) {
    var path = params.file;
    upload(path, url, cb);
  }
};
