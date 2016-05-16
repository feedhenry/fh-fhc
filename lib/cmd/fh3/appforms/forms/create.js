/* globals i18n */
var fs = require('fs');
var util = require('util');

module.exports = {
  'desc': i18n._('Creates A New Form.'),
  'examples': [{cmd: 'fhc appforms forms create --formfile=<path to form json file>', desc: i18n._('Creates A New Form')}],
  'demand': ['formfile'],
  'alias': {},
  'describe': {
    'formfile': i18n._('A Path To A File Containing A Valid JSON Definition Of A Form')
  },
  'url': '/api/v2/appforms/forms',
  'method': 'post',
  'preCmd': function (params, cb) {
    var formFilePath = params.formfile;
    //Reading The File Passed For Form Content
    fs.readFile(formFilePath, function (err, formFileContent) {
      if (err) {
        return cb(util.format(i18n._("Error Reading File At %s"), formFilePath) + " : " + err.code);
      }
      formFileContent = formFileContent || "";
      var formJSON;
      try {
        formJSON = JSON.parse(formFileContent);
      } catch (e) {
        return cb(i18n._("Invalid Form JSON Object"));
      }

      //The POST Request Should Contain The Form JSON Object
      return cb(err, formJSON);
    });
  }
};
