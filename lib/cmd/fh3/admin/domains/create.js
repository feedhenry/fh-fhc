/* globals i18n */
module.exports = {
  'desc' : i18n._('Create a domain'),
  'examples' : [{
    cmd : 'fhc admin domains create --name=<name> --type=<type> --theme=<theme> --parent=<parent> ',
    desc : i18n._('Create a domain with the <name>, type<type>, <theme> and <parent>')}],
  'demand' : ['name','type'],
  'perm' : "cluster/reseller/customer:write",
  'alias' : {
    'name':'n',
    'type':'t',
    'theme':'th',
    'parent':'p',
    0 : 'name',
    1 : 'type',
    2 : 'theme',
    3 : 'parent'
  },
  'describe' : {
    'name' : i18n._('Name of the domain'),
    'type' : i18n._("The type of the domain need be 'admin' or 'developer'"),
    'theme' : i18n._("The theme of the domain"),
    'parent' : i18n._("Unique 24 character GUID of your parent domain")
  },
  'url' : '/box/api/domains',
  'method' : 'post',
  'preCmd' : function(params, cb) {
    if ("admin" !== params.type && "developer" !== params.type) {
      return cb(i18n._("The type must be one of admin or developer"));
    }
    var theme = params.theme || "";
    var payload = {"domain": params.name, "parent":  params.parent, "type": params.type, "theme": theme};
    return cb(null, payload);
  }
};
