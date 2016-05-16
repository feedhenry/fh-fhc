/* globals i18n */
var stop = require('./_baseCloudCommand.js')('stop');
stop.desc = i18n._("Stops a cloud application. This command will only work if the app has previously been deployed");

module.exports = stop;
