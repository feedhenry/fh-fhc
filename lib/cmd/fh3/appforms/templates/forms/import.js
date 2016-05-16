/* globals i18n */
module.exports = {
  'desc': i18n._('Imports A Single Form Template.'),
  'examples': [{
    cmd: 'fhc appforms templates forms import --id=<Template ID> --name=<Name Of New Imported Form> --description=<Description For New Form>',
    desc: i18n._('Imports A Single Form Template.')
  }],
  'demand': ['id', 'name'],
  'alias': {},
  'describe': {
    'id': i18n._("Form Template ID To Import"),
    'name': i18n._("New Name For Imported Form"),
    'description': i18n._("Description For Imported Form")
  },
  'url': function (params) {
    return "/api/v2/appforms/templates/forms/" + params.id + "/import";
  },
  'method': 'post'
};
