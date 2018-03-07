var genericCommand = require('genericCommand');
var assert = require('assert');

var userCommand = {
  list: genericCommand(require('cmd/fh3/keys/user/list')),
  delete: genericCommand(require('cmd/fh3/keys/user/delete')),
  update: genericCommand(require('cmd/fh3/keys/user/update')),
  read: genericCommand(require('cmd/fh3/keys/user/read')),
  target: genericCommand(require('cmd/fh3/keys/user/target')),
  create: genericCommand(require('cmd/fh3/keys/user/create'))
};

var nock = require('nock');
var userList = {
  "list": [
    {
      "key": "ad351414f0769fdf443203e8ed07534711457f5d",
      "keyReference": "i4ze7ruomd27wnohth22to4v",
      "keyType": "user",
      "label": "FH_MBAAS_API_KEY",
      "revoked": null,
      "revokedBy": null,
      "revokedEmail": null
    }
  ],
  "status": "ok"
};

var key = {
  "apiKey": {
    "key": "ad351414f0769fdf443203e8ed07534711457f5d",
    "keyReference": "i4ze7ruomd27wnohth22to4v",
    "keyType": "user",
    "label": "FH_MBAAS_API_KEY",
    "revoked": null,
    "revokedBy": null,
    "revokedEmail": null
  },
  "status": "ok"
};
module.exports = nock('https://apps.feedhenry.com')
  .post('/box/srv/1.1/ide/apps/api/list')
  .times(9)
  .reply(200, userList)
  .post('/box/srv/1.1/ide/apps/api/delete')
  .times(2)
  .reply(200, key)
  .post('/box/srv/1.1/ide/apps/api/create')
  .times(2)
  .reply(200, key)
  .post('/box/srv/1.1/ide/apps/api/update')
  .times(2)
  .reply(200, key);


module.exports = {
  'test fhc keys user list' : function(cb) {
    userCommand.list({}, function(err, list) {
      assert.equal(err, null);
      assert.ok(list);
      var table = list._table;
      assert.equal(table['0'][0], 'FH_MBAAS_API_KEY');
      assert.equal(table['0'][1], 'ad351414f0769fdf443203e8ed07534711457f5d');
      return cb();
    });
  },
  'test fhc keys user list --json' : function(cb) {
    userCommand.list({json:true}, function(err, list) {
      assert.equal(err, null);
      assert.ok(list);
      assert.equal(list._table, null);
      return cb();
    });
  },
  'fhc keys user read --label' : function(cb) {
    userCommand.read({ label:"FH_MBAAS_API_KEY"}, function(err, list) {
      assert.equal(err, null);
      assert.ok(list);
      var table = list._table;
      assert.equal(table['0'][0], 'FH_MBAAS_API_KEY');
      assert.equal(table['0'][1], 'ad351414f0769fdf443203e8ed07534711457f5d');
      return cb();
    });
  },
  'fhc keys user read --label --json' : function(cb) {
    userCommand.read({ label:"FH_MBAAS_API_KEY", json:true}, function(err, list) {
      assert.equal(err, null);
      assert.ok(list);
      assert.equal(list._table, null);
      return cb();
    });
  },
  'fhc keys user target --label' : function(cb) {
    userCommand.target({ label:"FH_MBAAS_API_KEY"}, function(err) {
      assert.equal(err, null);
      return cb();
    });
  },
  'fhc keys user update --label --value' : function(cb) {
    userCommand.update({label:"FH_MBAAS_API_KEY", value:"FH_MBAAS_API_KEY2"}, function(err, data) {
      assert.equal(err, null);
      assert.ok(data);
      var table = data._table;
      assert.equal(table['0'][0], 'FH_MBAAS_API_KEY');
      assert.equal(table['0'][1], 'ad351414f0769fdf443203e8ed07534711457f5d');
      return cb();
    });
  },
  'fhc keys user update --label --value --json' : function(cb) {
    userCommand.update({label:"FH_MBAAS_API_KEY", value:"FH_MBAAS_API_KEY2", json:true}, function(err, data) {
      assert.equal(err, null);
      assert.ok(data);
      assert.equal(data._table, null);
      assert.equal(data.status, "ok");
      return cb();
    });
  },
  'fhc keys user delete --label' : function(cb) {
    userCommand.delete({label:"FH_MBAAS_API_KEY"}, function(err, data) {
      assert.equal(err, null);
      assert.ok(data);
      var table = data._table;
      assert.equal(table['0'][0], 'FH_MBAAS_API_KEY');
      assert.equal(table['0'][1], 'ad351414f0769fdf443203e8ed07534711457f5d');
      return cb();
    });
  },
  'fhc keys user delete --label --json' : function(cb) {
    userCommand.delete({label:"FH_MBAAS_API_KEY", json:true}, function(err, data) {
      assert.equal(err, null);
      assert.ok(data);
      assert.equal(data._table, null);
      assert.equal(data.status, "ok");
      return cb();
    });
  },
  'fhc keys user create --label' : function(cb) {
    userCommand.create({label:"FH_MBAAS_API_KEY"}, function(err, data) {
      assert.equal(err, null);
      assert.ok(data);
      var table = data._table;
      assert.equal(table['0'][0], 'FH_MBAAS_API_KEY');
      assert.equal(table['0'][1], 'ad351414f0769fdf443203e8ed07534711457f5d');
      return cb();
    });
  },
  'fhc keys user create --label --json' : function(cb) {
    userCommand.create({label:"FH_MBAAS_API_KEY", json:true}, function(err, data) {
      assert.equal(err, null);
      assert.ok(data);
      assert.equal(data._table, null);
      assert.equal(data.status, "ok");
      return cb();
    });
  }
};