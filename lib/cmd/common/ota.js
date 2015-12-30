module.exports = ota;

var fhc = require("../../fhc");

ota.desc = "Build OTA version of an app";
ota.usage = "\nfhc ota app=<appId> destination=<destination> version=<version> config=<config> keypass=<private-key-password> certpass=<certificate-password>"
  + "\nwhere <destination> is one of: android, iphone, ipad, blackberry, windowsphone7"
  + "\nwhere <version> is specific to the destination"
  + "\nwhere <config> is always distribution or release for OTA"
  + "\n'keypass' and 'certpass' only needed for 'release' builds";

var build = require('./build.js');
var request = require('request').defaults({'proxy': fhc.config.get("proxy")});

// main ota entry point
function ota(argv, cb) {
  try {
    build(argv, function (err, res) {
      if (err) {
        return cb(err);
      }
      if (res && res.length && res[0] && res[0].length && res[0][0].action) { // the response is strangely nested arrays -
        var url = res[0][0].action.url;
        url = url.replace(/\/[a-zA-Z]+~.+~/g, '/'); // Strip the platform~osVersion~versionNum string
        url = url.replace('.zip', '.plist'); // Make the zip a plist instead!
        url = "http://ota.feedhenry.com/ota/ios.html?url=" + url; // Now, throw the plist over to the ota server

        var shortenerRequestBody = {
          "longUrl": url
        };

        request({
          uri: 'https://www.googleapis.com/urlshortener/v1/url',
          method: 'POST',
          json: shortenerRequestBody
        }, function (err, response, body) {
          var shortUrl = body.id.replace("\\", "");
          ota.message = 'OTA URL: ' + url + '\nShort URL: ' + shortUrl;
          cb(undefined, {ota_url: url, short_url: shortUrl});
        });

      }
    });
  } catch (x) {
    return cb("Error processing args: " + x + "\nUsage: " + ota.usage);
  }
}
