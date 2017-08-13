var assert = require('assert');
var genericCommand = require('genericCommand');

var policiesCmd = {
  list: genericCommand(require('cmd/fh3/admin/policies/list')),
  read: genericCommand(require('cmd/fh3/admin/policies/read')),
  delete: genericCommand(require('cmd/fh3/admin/policies/delete')),
  create: genericCommand(require('cmd/fh3/admin/policies/create')),
  update: genericCommand(require('cmd/fh3/admin/policies/update')),
  userList: genericCommand(require('cmd/fh3/admin/policies/users/list')),
  userAdd: genericCommand(require('cmd/fh3/admin/policies/users/add')),
  userDelete: genericCommand(require('cmd/fh3/admin/policies/users/delete'))
};

var nock = require('nock');
var data = {
  "count": 2,
  "list": [
    {
      "checkUserApproved": true,
      "checkUserExists": true,
      "configurations": {
        "provider": "FEEDHENRY"
      },
      "guid": "iu5ig63cnt65jzxlntypuwib",
      "policyId": "FeedHenry",
      "policyType": "FEEDHENRY",
      "users": []
    },
    {
      "checkUserApproved": false,
      "checkUserExists": false,
      "configurations": {
        "authEndpoint": "/api/wfm/user/auth",
        "defaultEnvironment": "dev",
        "mbaas": "n2krmb3ukuwo23fl62sudym5",
        "provider": "MBAAS"
      },
      "guid": "vugctnmam5nk44h2b5xgxupu",
      "policyId": "auth-wfm-3152-022017",
      "policyType": "MBAAS",
      "users": [
        {
          "email": "testread@redhat.com",
          "guid": "brxf2jh5sgeirdgch3kol572",
          "name": "",
          "userId": "testread@redhat.com"
        }
      ]
    }
  ],
  "status": "ok"
};

var dataPolicy = {
  "checkUserApproved": false,
  "checkUserExists": false,
  "configurations": {
    "provider": "FEEDHENRY"
  },
  "guid": "xpzaqtip2ctewg3hudhiyeuv",
  "policyId": "FeedHenry",
  "policyType": "FEEDHENRY",
  "status": "ok",
  "users": [ {
    "email": "testread@redhat.com",
    "guid": "brxf2jh5sgeirdgch3kol572",
    "name": "",
    "userId": "testread@redhat.com"
  }]
};

module.exports = nock('https://apps.feedhenry.com')
  .post('/box/srv/1.1/admin/authpolicy/read')
  .times(6)
  .reply(200, dataPolicy)
  .post('/box/srv/1.1/admin/authpolicy/create')
  .times(2)
  .reply(200, dataPolicy)
  .post('/box/srv/1.1/admin/authpolicy/delete')
  .times(1)
  .reply(200, dataPolicy)
  .get('/box/srv/1.1/admin/authpolicy/list')
  .times(3)
  .reply(200, data)
  .post('/box/srv/1.1/admin/authpolicy/addusers')
  .reply(200, {})
  .post('/box/srv/1.1/admin/authpolicy/removeusers')
  .reply(200, {})
  .post('/box/srv/1.1/admin/authpolicy/update')
  .times(2)
  .reply(200, dataPolicy);


module.exports = {
  'test fhc admin policies list': function(cb) {
    policiesCmd.list({}, function(err, data) {
      assert.equal(err, null);
      assert.equal(data.status, "ok");
      var table = data._table;
      assert.equal(table['0'][0], 'iu5ig63cnt65jzxlntypuwib');
      assert.equal(table['0'][1], 'FeedHenry');
      assert.equal(table['0'][2], 'FEEDHENRY');
      assert.equal(table['0'][3], 'Yes');
      assert.equal(table['0'][4], 'Yes');
      return cb();
    });
  },
  'test fhc admin policies list --json': function(cb) {
    policiesCmd.list({json:true}, function(err, data) {
      assert.equal(err, null);
      assert.equal(data.status, "ok");
      assert.equal(data._table, null);
      return cb();
    });
  },
  'test fhc admin policies read --id --json': function(cb) {
    policiesCmd.read({id:"FeedHenry",json:true}, function(err, data) {
      assert.equal(err, null);
      assert.equal(data.status, "ok");
      assert.equal(data._table, null);
      return cb();
    });
  },
  'test fhc admin policies read --id ': function(cb) {
    policiesCmd.read({id:"FeedHenry"}, function(err, data) {
      assert.equal(err, null);
      assert.equal(data.status, "ok");
      var table = data._table;
      assert.equal(table['0'][0], 'xpzaqtip2ctewg3hudhiyeuv');
      assert.equal(table['0'][1], 'FeedHenry');
      assert.equal(table['0'][2], 'FEEDHENRY');
      return cb();
    });
  },
  'test fhc admin policies delete --id --json': function(cb) {
    policiesCmd.delete({id:"FeedHenry",json:true}, function(err, data) {
      assert.equal(err, null);
      assert.equal(data.status, "ok");
      assert.equal(data._table, null);
      return cb();
    });
  },
  'test fhc admin policies update --id --type --json': function(cb) {
    policiesCmd.update({id:"FeedHenry",type:"FEEDHENRY",json:true}, function(err, data) {
      assert.equal(err, null);
      assert.equal(data.status, "ok");
      assert.equal(data._table, null);
      return cb();
    });
  },
  'test fhc admin policies  update --id --type ': function(cb) {
    policiesCmd.update({id:"FeedHenry",type:"FEEDHENRY"}, function(err, data) {
      assert.equal(err, null);
      assert.equal(data.status, "ok");
      var table = data._table;
      assert.equal(table['0'][0], 'xpzaqtip2ctewg3hudhiyeuv');
      assert.equal(table['0'][1], 'FeedHenry');
      assert.equal(table['0'][2], 'FEEDHENRY');
      return cb();
    });
  },
  'test fhc admin policies users list --id --json': function(cb) {
    policiesCmd.userList({id:"FeedHenry",json:true}, function(err, data) {
      assert.equal(err, null);
      assert.equal(data._table, null);
      return cb();
    });
  },
  'test fhc admin policies users list': function(cb) {
    policiesCmd.userList({id:"FeedHenry"}, function(err, data) {
      assert.equal(err, null);
      var table = data._table;
      assert.equal(table['0'][0], 'brxf2jh5sgeirdgch3kol572');
      assert.equal(table['0'][1], 'testread@redhat.com');
      return cb();
    });
  },
  'test fhc admin policies users add --guid --user': function(cb) {
    policiesCmd.userAdd({guid:"brxf2jh5sgeirdgch3kol572", user:'testread@redhat.com'}, function(err) {
      assert.equal(err, null);
      return cb();
    });
  },
  'test fhc admin policies users delete --guid --user': function(cb) {
    policiesCmd.userDelete({guid:"brxf2jh5sgeirdgch3kol572", user:'testread@redhat.com'}, function(err) {
      assert.equal(err, null);
      return cb();
    });
  },
  'test fhc admin policies create --id --type --json': function(cb) {
    policiesCmd.create({id:"FeedHenry",type:"FEEDHENRY", configurations:'{"provider":"FEEDHENRY"}',json:true}, function(err, data) {
      assert.equal(err, null);
      assert.equal(data.status, "ok");
      assert.equal(data._table, null);
      return cb();
    });
  },
  'test fhc admin policies create --id --type  ': function(cb) {
    policiesCmd.create({id:"FeedHenry",type:"FEEDHENRY", configurations:'{"provider":"FEEDHENRY"}'}, function(err, data) {
      assert.equal(err, null);
      assert.equal(data.status, "ok");
      var table = data._table;
      assert.equal(table['0'][0], 'xpzaqtip2ctewg3hudhiyeuv');
      assert.equal(table['0'][1], 'FeedHenry');
      assert.equal(table['0'][2], 'FEEDHENRY');
      return cb();
    });
  },
};