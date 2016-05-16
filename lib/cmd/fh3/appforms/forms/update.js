/* globals i18n */
var fs = require('fs');
var _ = require('underscore');

module.exports = {
  'desc': i18n._('Update A Single Form.'),
  'examples': [{
    cmd: 'fhc appforms forms update --id=<id of form to update> --formfile=<path to form json file>',
    desc: i18n._('Update A Single Form')
  }],
  'demand': ['formfile', 'id'],
  'alias': {},
  'describe': {
    'id': i18n._('ID Of The Form To Update'),
    'formfile': i18n._('A Path To A File Containing A Valid JSON Definition Of A Form')
  },
  'url': function (params) {
    return "/api/v2/appforms/forms/" + params.id;
  },
  'method': 'put',
  'preCmd': function (params, cb) {
    var formFilePath = params.formfile;

    //Reading The File Passed For Form Content
    fs.readFile(formFilePath, function (err, formFileContent) {
      formFileContent = formFileContent || "";
      var formJSON;
      try {
        formJSON = JSON.parse(formFileContent);
      } catch (e) {
        return cb(i18n._("Invalid Form JSON Object"));
      }

      //The POST Request Should Contain The Form JSON Object
      return cb(err, _.extend(formJSON, params));
    });
  }
};
