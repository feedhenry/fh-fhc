var fhreq = require("./utils/request"),
ini = require('./utils/ini'),
URL_PREFIX,
getCreateDocument,
getUpdateDocument;

/*
  A DRY command module for RESTful endpoints like those found in supercore. 
  Delegates retrieval of document body for POST and PUT requests, everything else stays the same once we 
  adhere to REST.
  Usage:
  require('./restful-cmd')({
    url : '/your/restful/url',
    usage : 'usageString',
    getCreateDocument : function(ini, cb){ handle building a create body}
    getUpdateDocument : function(ini, cb){ handle building an update body}
  });
 */
module.exports = function(params){
  restful_cmd.usage = params.usage;
  URL_PREFIX = params.url;
  getCreateDocument = params.getCreateDocument;
  getUpdateDocument = params.getUpdateDocument;
  return restful_cmd;
};

restful_cmd.list = list;
function restful_cmd (args, cb) {
  if (args.length === 0){
    return list(args, cb);
  }

  var action = args[0];
  if ((['list', 'create'].indexOf(action)===-1) && typeof ini.get('id') === 'undefined'){
    return cb(restful_cmd.usage);
  }
  
  switch(action){
    case 'list':
      list(args, cb);
      break;
    case 'read':
      read(args, cb);
      break;
    case 'create':
      create(args, cb);
      break;
    case 'update':
      update(args, cb);
      break;
    case 'delete':
      del(args, cb);
      break;
    default:
      cb(restful_cmd.usage);
      break;
  }
  return;
}

function _generateRequestCallback(cb){
  return function(err, remoteData, raw, res) {
    if (err){
      return cb(err);
    } 
    if (res.statusCode !== 200){
      return cb('Unexpected response code: ' + res.statusCode + ' - ' + raw);
    } 
    remoteData.status = "ok";
    remoteData.statusCode = 200;
    return cb(err, remoteData);
  };
}

// list devices
function list(args, cb) {
  return fhreq.GET(fhreq.getFeedHenryUrl(), URL_PREFIX, _generateRequestCallback(cb));
}

function create(args, cb) {
  var document = getCreateDocument(ini, function(err, document){
    if (err){
      return cb(err + '\n' + restful_cmd.usage);
    }
    return fhreq.POST(fhreq.getFeedHenryUrl(), URL_PREFIX, document, _generateRequestCallback(cb));  
  });
}

function update(args, cb) {
  var id = ini.get('id'),
  document = getUpdateDocument(ini, function(err, document){
    if (err){
      return cb(err + '\n' + restful_cmd.usage);
    }
    return fhreq.PUT(fhreq.getFeedHenryUrl(), URL_PREFIX + "/" + id, document, _generateRequestCallback(cb));
  });
}

function read(args, cb) {
  var id = ini.get('id');
  return fhreq.GET(fhreq.getFeedHenryUrl(), URL_PREFIX + "/" + id, _generateRequestCallback(cb));
}

function del(args, cb) {
  var id = ini.get('id');
  return fhreq.DELETE(fhreq.getFeedHenryUrl(), URL_PREFIX + "/" + id, _generateRequestCallback(cb));
}
