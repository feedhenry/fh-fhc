/* globals i18n */
var base = require('./_baseCloudRequest')('cloud');
base.desc = i18n._("Performs a cloud request on a cloud app");
base.demand.push('path');
base.describe.path = i18n._('Path of the cloud request');
base.examples = [
  {
    cmd: 'fhc app cloud --app=1a2b3c --path=<serverside path from root> --data=<Data to send> --env=<environment>',
    desc: i18n._('Performs a cloud request on app with id 1a2b3c')
  }
];
module.exports = base;
