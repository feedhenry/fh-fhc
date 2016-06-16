/* globals i18n */
var url = '/api/v2/appforms/forms/import';
var upload = require('../../../../utils/request').importUpload;
var fs = require('fs');
var util = require('util');

module.exports = {
  'desc': i18n._('Imports a zip file containing definitions for multiple forms, intended to be used with *export* (Platform version >= 3.10.0 required.)'),
  'examples': [{cmd: 'fhc appforms forms import --file=<path to zip file>', desc: i18n._('Imports forms contained in the zip file')}],
  'demand': ['file'],
  'alias': {},
  'describe': {
    'file': i18n._('Path to a file')
  },
  'url': url,
  'method': 'post',
  'customCmd': function(params, cb) {
    var path = params.file;
    fs.stat(path, function(err, stats) {
      if (err) {
        return cb(new Error(util.format(i18n._('File %s not found'), path)));
      }
      if (!stats.isFile()) {
        return cb(new Error(util.format(i18n._('%s is not a file'), path)));
      }
      upload(path, url, function(err) {
        if (err) {
          return cb(err);
        }
        console.log(util.format(i18n._('File %s uploaded successfully'), path));
        cb();
      });
    });
  }
};
