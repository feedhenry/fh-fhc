var _ = require('underscore');
var common = require("../common");
var fhreq = require("./request");

function checkMbaasType(request, cb) {
  var url = '/api/v2/mbaases/' + request.target;
  common.doGetApiCall(fhreq.getFeedHenryUrl(), url, i18n._('Error checking MBaaS type'), function checkIfTokenRequired(err, response) {
    if (err) {
      return cb(err);
    }

    request.targetType = response.type;

    // Ensure that a token is provided if creating an openshift3 environment
    if (response.type === 'openshift3' && typeof request.token === 'undefined') {
      return cb(i18n._('OpenShift targets require a token to be provided'));
    }

    if (response.type === 'feedhenry' && request.token) {
      return cb(i18n._('FeedHenry targets do not accept tokens'));
    }

    return cb(null, request);
  });
};

module.exports = {
  check: checkMbaasType
};
