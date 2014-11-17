module.exports = { 
  'desc' : 'Lists teams.',
  'examples' : [{ cmd : 'admin teams userteams --user=1a2b', desc : 'Lists user teams with id 1a2b'}],
  'demand' : ['user'],
  'alias' : {
    'user': 'u',
    0 : 'user'
  },
  'describe' : {
    'user' : 'A unique user GUID'
  },
  'url' : function(argv){
    return "api/v2/admin/users/" + argv.user + "/teams";
  },
  'method' : 'get',
};
