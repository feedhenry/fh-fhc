/* globals i18n */
var adduser = require('./_addremoveuser')('Add');
adduser.desc = i18n._("Add a user to a specified team.");
adduser.examples.desc = i18n._("Add user 2b to team 1a");

module.exports = adduser;
