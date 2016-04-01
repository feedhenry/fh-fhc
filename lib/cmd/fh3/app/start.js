/* globals i18n */
var start = require('./_baseCloudCommand.js')('start');
start.desc = i18n._("Starts a cloud application. This command will only work if the app has previously been deployed");

module.exports = start;
