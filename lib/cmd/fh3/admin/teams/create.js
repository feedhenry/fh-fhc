var fs = require('fs');
module.exports = { 
  'desc' : 'Creates a team.',
  'examples' : [{ cmd : 'fh admin teams create --team=myteam.json', desc : 'Creates a team from file myteam.json'}],
  'demand' : ['team'],
  'alias' : {
    0 : 'team'
  },
  'describe' : {
    'team' : 'a .json filename for your team'
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
        return cb("Failed to parse team def");
      }
    }
    return cb(null, teamDefCont);
  }
};
