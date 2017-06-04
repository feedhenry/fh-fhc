/* globals i18n */
var fhreq = require("../../utils/request");
var common = require("../../common.js");

module.exports = {
  'desc' : i18n._('Shorten a URL with the henr.ie URL shortener'),
  'examples' :
    [{
      cmd : 'fhc shortenurl --url=<url>',
      desc : "Shorten the <url> with the henr.ie URL shortener (E.g http://henr.ie/2s7DFXA)"
    }],
  'demand' : ['url'],
  'alias' : {
    'url': 'u',
    0: 'url'
  },
  'describe' : {
    'url' : i18n._("Long value of URL that you want shorter for the henr.ie URL")
  },
  'customCmd' : function(params,cb) {
    common.doApiCall(fhreq.getFeedHenryUrl(), "box/api/shortenurl", {longUrl: params.url}, "", function(err, data) {
      if (err) {
        return cb(i18n._("Error in shorten url: ") + err);
      }
      return cb(err, data);
    });
  }
};