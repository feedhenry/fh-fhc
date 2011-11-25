
module.exports = search;

search.usage = "\nfhc apps search <query>";

var log = require("./utils/log");
var fhc = require("./fhc");
var fhreq = require("./utils/request");
var common = require("./common");
var util = require('util');
var ini = require('./utils/ini');

// main search entry point
function search (args, cb) { 
  if (args.length == 1){
    var query = args[0];
    return doSearch(query, cb);
  } else{
    return cb(search.usage);
  } 
};

// do the actual Search
function doSearch(query, cb) { 
  var payload = {payload:{search:query},context:{}};   
  common.doApiCall(fhreq.getFeedHenryUrl(), "box/srv/1.1/ide/" + fhc.domain + "/app/search", payload, "Error searching for app: ", function(err, data){
    if(err) return cb(err);

    if(ini.get('table') === true && data) {
      search.table = common.createTableForApps(data.list);
    }

    return cb(err, data);
  });
};

