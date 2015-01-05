module.exports = function(method){
  return { 
    'desc' : method + ' a user to a specified team.',
    'examples' : [{ cmd : 'fh admin teams ' + method.toLowerCase() + 'user --team=1a --user=2b', desc : method + ' user 2b to team 1a'}],
    'demand' : ['team', 'user'],
    'alias' : {
      0 : 'team',
      1 : 'user'
    },
    'describe' : {
      'team' : 'A unique team id',
      'user' : 'A unique user id'
    },
    'url' : function(params){
      return "api/v2/admin/teams/" + params.team + "/user/" + params.user;
    },
    'method' : (method.toLowerCase() === 'add') ? 'post' : 'delete'
  };
  
}
