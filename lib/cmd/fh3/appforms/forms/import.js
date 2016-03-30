var url = '/api/v2/appforms/forms/import';
var upload = require('../../../../utils/request').formsImportZipFileUpload;
var fs = require('fs');

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
    fs.stat(path, function(err, stats) {
      if (err) {
        return cb(new Error('File ' + path + " not found"));
      }
      if (!stats.isFile()) {
        return cb(new Error(path + " is not a file"));
      }
      upload(path, url, function(err) {
        if (err) {
          return cb(err);
        }
        console.log('File ' + path + ' uploaded successfully');
        cb();
      });
    });
  }
};
