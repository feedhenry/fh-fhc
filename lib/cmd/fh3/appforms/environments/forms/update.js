var fs = require('fs');
var _ = require('underscore');

module.exports = {
  'desc': 'Update A Single Form In An Environment',
  'examples': [{
    cmd: 'fhc appforms environments forms update --id=<ID Of Form To Update> --environment=<ID Of Environment To Update Form> --formfile=<Path To Form JSON File>',
    desc: 'Update A Single Form Deployed To An Environment'
  }],
  'demand': ['environment', 'id', 'formfile'],
  'alias': {},
  'describe': {
    'id': "ID Of Form To Update",
    'environment': "ID Of Environment To List Forms",
    'formfile': "Path To Form JSON File"
  },
  'url': function (params) {
    return "/api/v2/mbaas/" + params.environment + "/appforms/forms/" + params.id + "/deploy";
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