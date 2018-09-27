/* globals i18n */
module.exports = {
  'customCmd' : function(params,cb) {
    return cb(new Error(i18n._("fhc build command is deprecated. For more details, please see https://redhatmobilestatus.com/2018/09/26/immediate-deprecation-of-the-rhmap-client-binary-build-service-build-farm/.")));
  }
};
