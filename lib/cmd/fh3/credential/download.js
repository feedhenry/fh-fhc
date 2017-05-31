/* globals i18n */
var fhreq = require('../../../utils/request.js');
var fs = require('fs');
var util = require('util');

module.exports = {
  'desc' : i18n._('Download credential bundle'),
  'examples' :
  [{
    cmd : 'fhc credential download --id=<id> --output=<Path To Output File>',
    desc : "Download the credential bundle with <id>"
  }],
  'demand' : ['id', 'output'],
  'alias' : {
    'id': 'i',
    'output': 'o',
    0: 'id',
    1: 'output'
  },
  'describe' : {
    'id' : i18n._("Unique 24 character BundleID of the credential bundle that you want to download"),
    'output': i18n._("Path of file to output downloaded file to (E.g '--privateKey=/Users/user/ or --privateKey=/Users/user/mybundle.zip')")
  },
  'customCmd': function(params, cb) {
    //Custom commad to make a file request, in this case, the returned file is a PDF.
    params.url = "/box/api/credentials/" + params.id + "/download";
    params.method = 'get';

    if (params.output[params.output.length -1] === "/") {
      params.output = params.output + params.id + ".zip";
    }

    fs.stat(params.output, function(err) {
      if (!err) {
        return cb(util.format(i18n._("The file at path %s already exists."), params.output));
      }
      fhreq.downloadFile(params, cb);
    });
  }
};
