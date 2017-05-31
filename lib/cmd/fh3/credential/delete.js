/* globals i18n */
module.exports = {
  'desc' : i18n._('Delete credential bundle'),
  'examples' :
  [{
    cmd : 'fhc credential delete --id=<bundle-id>',
    desc : "Delete the credential bundle with the id=<bundle-id>"
  }],
  'demand' : ['id'],
  'alias' : {
    'id': 'i',
    0: 'id'
  },
  'describe' : {
    'id' : i18n._("Unique 24 character BundleID of the credential bundle that you want to delete")
  },
  'url' : function(argv) {
    var bundleId = argv.id;
    return "/box/api/credentials/" + bundleId;
  },
  'method' : 'delete',
  'postCmd': function(response, cb) {
    if (response.status === 'ok') {
      return cb(null, i18n._("Credential bundle deleted successfully"));
    }
    return cb(null, response);
  }
};