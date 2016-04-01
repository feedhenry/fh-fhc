/* globals i18n */
module.exports = {
  'desc': i18n._('Imports A Single Theme Template.'),
  'examples': [{
    cmd: 'fhc appforms templates themes import --id=<Template ID> --name=<Name Of New Imported Theme> --description=<Description For New Theme>',
    desc: i18n._('Imports A Single Theme Template.')
  }],
  'demand': ['id', 'name'],
  'alias': {},
  'describe': {
    'id': i18n._("Theme Template ID To Import"),
    'name': i18n._("New Name For Imported Theme"),
    'description': i18n._("Description For Imported Theme")
  },
  'url': function (params) {
    return "/api/v2/appforms/templates/themes/" + params.id + "/import";
  },
  'method': 'post'
};
