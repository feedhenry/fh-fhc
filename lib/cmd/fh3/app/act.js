/* globals i18n */
var base = require('./_baseCloudRequest')('act');
base.desc = i18n._("Performs an act request on a cloud app.");
base.describe.fn = i18n._('Cloud function name to call');
base.demand.push('fn');
base.examples = [
  {
    cmd: 'fhc app act --app=1a2b3c --fn=<serverside Function> --data=<data to send> --env=<environment>',
    desc: i18n._('Performs an act request on app with id 1a2b3c')
  }
];

module.exports = base;
