module.exports = search;

search.usage = "\nfhc search <query>";

var fhc = require("../../fhc");
var fhreq = require("../../utils/request");
var common = require("../../common");
var ini = require('../../utils/ini');

// main search entry point
function search(argv, cb) {
  var args = argv._;
  if (args.length === 1) {
    var query = args[0];
    return doSearch(query, cb);
  } else {
    return cb(search.usage);
  }
}

// do the actual Search
function doSearch(query, cb) {
  var payload = {payload: {search: query}, context: {}};
  common.doApiCall(fhreq.getFeedHenryUrl(), "box/srv/1.1/ide/" + fhc.curTarget + "/app/search", payload, "Error searching for App: " + query, function (err, data) {
    if (err) return cb(err);

    if (ini.get('table') === true && data) {
      search.table = common.createTableForApps(data.list);
    }
    return cb(err, data);
  });
}
