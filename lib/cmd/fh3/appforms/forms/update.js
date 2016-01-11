var fs = require('fs');
var _ = require('underscore');

module.exports = {
  'desc': 'Update A Single Form.',
  'examples': [{
    cmd: 'fhc appforms forms update --id=<id of form to update> --formfile=<path to form json file>',
    desc: 'Update A Single Form'
  }],
  'demand': ['formfile', 'id'],
  'alias': {},
  'describe': {
    'id': 'ID Of The Form To Update',
    'formfile': 'A Path To A File Containing A Valid JSON Definition Of A Form'
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
        return cb("Invalid Form JSON Object");
      }

      //The POST Request Should Contain The Form JSON Object
      return cb(err, _.extend(formJSON, params));
    });
  }
};
