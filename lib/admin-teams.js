
var common = require("./common");
var fs = require('fs');

var fhreq = require("./utils/request");

var TEAMS_URL = "api/v2/admin";
module.exports = function adminteams(args, cb){
  var cmd = args[0];
  if(cmd && cmd === "list"){
    return listTeams(cb);
  }else if(cmd && cmd === "create"){
    return createTeam(args[1],cb);
  }else if(cmd && cmd === "del"){
    return deleteTeam(args[1],cb);
  }else if(cmd && cmd === "adduser"){
    var userId = args[1];
    var teamId = args[2];
    return addUser(userId,teamId, cb);
  }else if(cmd === "userteams"){
    return listUserTeams(args[1],cb);
  }else if(cmd === "read"){
    return readTeam(args[1], cb);
  }else if(cmd === "update team"){

  }else if(cmd === "removeuser"){
    return removeUser(args[1],args[2],cb);
  }

};



function listTeams(cb){
  var url = TEAMS_URL + "/teams";
  fhreq.GET( fhreq.getFeedHenryUrl() , url, function (err, remoteData, raw, res) {
    if(err) return cb(err);
    return cb(undefined, raw);
  });
}

function readTeam(teamId, cb){
  var url = TEAMS_URL + "/teams/" + teamId;
  fhreq.GET( fhreq.getFeedHenryUrl() , url, function (err, remoteData, raw, res) {
    if(err) return cb(err);
    return cb(undefined, raw);
  });
}

function listUserTeams(userId,cb){
  var usage = "admin-teams userteams <userid>";
  if(! userId) return cb(usage);
  var url = TEAMS_URL + "/users/"+userId + "/teams";
  fhreq.GET( fhreq.getFeedHenryUrl() , url, function (err, remoteData, raw, res) {
    if(err) return cb(err);
    return cb(undefined, raw);
  });
}


function createTeam(teamDef,cb){
  var teamDefCont;
  if(teamDef && "string" === typeof teamDef && teamDef.indexOf(".json") != -1){
    teamDefCont = fs.readFileSync(teamDef);
    teamDefCont = JSON.parse(teamDefCont);
  }
  else{
    try{
      teamDefCont = JSON.parse(teamDef.toString());
    }catch(e){
      cb("Failed to parse team def");
    }
  }
  var url = TEAMS_URL + "/teams";
  fhreq.POST( fhreq.getFeedHenryUrl() , url,teamDefCont, function (err, remoteData, raw, res) {
    if(err) return cb(err);
    return cb(undefined, raw);
  });
}

function deleteTeam(teamId, cb){
  var usage = "admin-teams del <teamid>";
  if(! teamId) return cb();
  var url = TEAMS_URL + "/teams/"+teamId;
  fhreq.DELETE( fhreq.getFeedHenryUrl() , url, function (err, remoteData, raw, res) {
    if(err) return cb(err);
    return cb(undefined, raw);
  });

}

function addUser(userId,teamId,cb){
  var usage = "admin-teams adduser <userid> <teamid>";
  if(!userId || ! teamId)return cb(usage);
  var url = TEAMS_URL + "/teams/" + teamId + "/user/" + userId;
  fhreq.POST( fhreq.getFeedHenryUrl() , url,{}, function (err, remoteData, raw, res) {
    if(err) return cb(err);
    return cb(undefined, raw);
  });
}


function removeUser(userId,teamId,cb){
  var usage = "admin-teams remove <userid> <teamid>";
  if(!userId || ! teamId)return cb(usage);
  var url = TEAMS_URL + "/teams/" + teamId + "/user/" + userId;
  fhreq.DELETE( fhreq.getFeedHenryUrl() , url,{}, function (err, remoteData, raw, res) {
    if(err) return cb(err);
    return cb(undefined, raw);
  });
}