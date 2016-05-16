/* globals i18n */
module.exports = {
  'desc' : i18n._('Lists teams.'),
  'examples' : [{ cmd : 'admin teams userteams --user=1a2b', desc : i18n._('Lists user teams with id 1a2b')}],
  'demand' : ['user'],
  'alias' : {
    'user': 'u',
    0 : 'user'
  },
  'describe' : {
    'user' : i18n._('A unique user GUID')
  },
  'url' : function(argv){
    return "api/v2/admin/users/" + argv.user + "/teams";
  },
  'method' : 'get'
};
