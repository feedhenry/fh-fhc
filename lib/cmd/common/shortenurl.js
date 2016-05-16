/* globals i18n */
module.exports = shortenurl;

shortenurl.usage = "\nfhc shortenurl <url>";
shortenurl.desc = i18n._("Shorten a URL with the henr.ie URL shortener");

var log = require("../../utils/log");
var fhreq = require("../../utils/request");
var common = require("../../common.js");

function shortenurl(argv, cb) {
  var args = argv._;
  if (args.length < 1) return cb(shortenurl.usage);

  var longUrl = args[0];
  common.doApiCall(fhreq.getFeedHenryUrl(), "box/api/shortenurl", {longUrl: longUrl}, "", function (err, data) {
    if (err) {
      log.error(i18n._("Error in shortenurl: "), err);
      return cb(err);
    }
    return cb(err, data);
  });
}
