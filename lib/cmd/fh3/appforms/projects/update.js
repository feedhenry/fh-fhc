/* globals i18n */
var _ = require('underscore');

module.exports = {
  'desc': i18n._('Update A Single Form Project.'),
  'examples': [{
    cmd: 'fhc appforms projects update --id=<GUID Of Form Project To Update> --theme=<ID Of Theme To Associate With The Project> --forms=<formId1>,<formId2>',
    desc: i18n._('Update A Single Form Project')
  }],
  'demand': ['id'],
  'alias': {},
  'describe': {
    'id': i18n._('GUID Of The Form Project To Update'),
    'theme': i18n._('The ID Of The Theme To Associate With The Form Project'),
    'forms': i18n._('Comma-separated List Of Form IDs To Associate With The Form Project')
  },
  'url': function (params) {
    return "/api/v2/appforms/apps/" + params.id;
  },
  'method': 'put',
  'preCmd': function (params, cb) {

    var theme = params.theme;
    var forms = params.forms || "";

    forms = forms.split(',');
    forms = _.compact(forms);

    var dataObject = {
      id: params.id,
      forms: forms
    };

    if (theme) {
      dataObject.theme = params.theme;
    }

    return cb(undefined, dataObject);

  }
};
