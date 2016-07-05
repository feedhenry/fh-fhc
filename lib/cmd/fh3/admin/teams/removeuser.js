/* globals i18n */
var removeuser = require('./_addremoveuser')('Remove');
removeuser.desc = i18n._("Remove a user from a specified team.");
removeuser.examples.desc = i18n._("Remove user 2b from team 1a");

module.exports = removeuser;
