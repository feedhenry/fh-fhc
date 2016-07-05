/* globals i18n */
var fs = require('fs');
module.exports = {
  'desc' : i18n._('Creates a team.'),
  'examples' : [{ cmd : 'fhc admin teams create --team=myteam.json', desc : i18n._('Creates a team from file myteam.json')}],
  'demand' : ['team'],
  'alias' : {
    0 : 'team'
  },
  'describe' : {
    'team' : i18n._('a .json filename for your team')
  },
  'url' : '/api/v2/admin/teams',
  'method' : 'post',
  'preCmd' : function(params, cb){
    var teamDef = params.team,
      teamDefCont;
    if(teamDef && "string" === typeof teamDef && teamDef.indexOf(".json") !== -1){
      teamDefCont = fs.readFileSync(teamDef);
      teamDefCont = JSON.parse(teamDefCont);
    }else{
      try{
        teamDefCont = JSON.parse(teamDef.toString());
      }catch(e){
        return cb(i18n._("Failed to parse team def"));
      }
    }
    return cb(null, teamDefCont);
  }
};
