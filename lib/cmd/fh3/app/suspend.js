/* globals i18n */
var suspend = require('./_baseCloudCommand.js')('suspend');
suspend.desc = i18n._("Suspends a cloud application. This command will only work if the app has previously been deployed");

module.exports = suspend;
