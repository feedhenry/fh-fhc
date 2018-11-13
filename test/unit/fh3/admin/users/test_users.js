var assert = require('assert');
var genericCommand = require('genericCommand');
var commands = {
  create: genericCommand(require('cmd/fh3/admin/users/create')),
  delete : genericCommand(require('cmd/fh3/admin/users/delete')),
  update : genericCommand(require('cmd/fh3/admin/users/update')),
  changeroles : genericCommand(require('cmd/fh3/admin/users/changeroles')),
  changeauthpolicies : genericCommand(require('cmd/fh3/admin/users/changeauthpolicies')),
  disable : genericCommand(require('cmd/fh3/admin/users/disable')),
  enable : genericCommand(require('cmd/fh3/admin/users/enable')),
  list: genericCommand(require('cmd/fh3/admin/users/list')),
  read: genericCommand(require('cmd/fh3/admin/users/read')),
  listinstallapps: genericCommand(require('cmd/fh3/admin/users/listinstallapps')),
  listdevices: genericCommand(require('cmd/fh3/admin/users/listdevices'))
};

var dataList = {
  "count": 2,
  "list": [
    {
      "fields": {
        "activated": true,
        "blacklisted": false,
        "businessObject": "cluster/reseller/user",
        "defaultDomain": "",
        "email": "feedhenry-qa.radm@example.com",
        "enabled": true,
        "lastLogin": "2017-08-14 15:36:52",
        "name": "FeedHenry QA Reseller Administrator",
        "parentEntity": "ResellerImpl:t-ub7fDklyz-gwe3oL5DPupH:FeedHenry QA",
        "prefs": {
          "accountType": "enterprise",
          "studio.version": "beta",
          "viewType": "table"
        },
        "reseller": "t-ub7fDklyz-gwe3oL5DPupH",
        "subscriber": "qY3_MkX4dT4iCtZ3lz4BSpVD",
        "sysCreated": "2014-10-22 12:10:30:015",
        "sysGroupFlags": 65567,
        "sysGroupList": "",
        "sysModified": "2017-08-14 15:36:52:417",
        "sysShardPoint": 1738610918,
        "sysVersion": 946,
        "tenant": "",
        "username": "feedhenry-qa.radm@example.com"
      },
      "guid": "Ou3Nt_FRP9cw1ATChbvz57Qv",
      "type": "ten_User"
    },
    {
      "fields": {
        "activated": true,
        "blacklisted": false,
        "businessObject": "cluster/reseller/user",
        "defaultDomain": "",
        "email": "conor.oneill@feedhenry.com",
        "enabled": true,
        "lastLogin": "2015-02-12 15:26:37",
        "name": "Conor O'Neill",
        "parentEntity": "ResellerImpl:t-ub7fDklyz-gwe3oL5DPupH:FeedHenry QA",
        "prefs": {
          "accountType": "enterprise",
          "studio.version": "beta",
          "viewType": "grid"
        },
        "reseller": "t-ub7fDklyz-gwe3oL5DPupH",
        "subscriber": "VWsAeCoROuZreClLXKar-fcZ",
        "sysCreated": "2014-11-13 12:18:45:073",
        "sysGroupFlags": 65759,
        "sysGroupList": "",
        "sysModified": "2017-08-01 09:57:53:058",
        "sysShardPoint": 1930711925,
        "sysVersion": 599,
        "tenant": "",
        "username": "conor.oneill@feedhenry.com"
      },
      "guid": "RlGISR7slmW_xZ5iR4D1Y1di",
      "type": "ten_User"
    }
  ],
  "status": "ok"
};

var data = {
  "fhaaa.authorisation.enabled": "true",
  "fields": {
    "activated": true,
    "authpolicies": [
      "bpkyt5cq63xd3pzrqgeaebzj",
      "6i2gzbdgba34e4lzjit2kxsm"
    ],
    "blacklisted": false,
    "businessObject": "cluster/reseller/customer/user",
    "customerRoles": [
      "sub"
    ],
    "defaultDomain": "",
    "email": "ndonnell@redhat.com",
    "enabled": true,
    "fhaaa.authorisation.enabled": true,
    "groups": [],
    "hierarchy": {
      "cluster": "sam1-core",
      "cluster/reseller": "t-ub7fDklyz-gwe3oL5DPupH",
      "cluster/reseller/customer": "44WKNggefW9N0ggTtqN2SFuF",
      "cluster/reseller/customer/user": "25zmxbt3ky2oytmda6uqcuql"
    },
    "lastLogin": "2017-05-18 11:28:35",
    "name": "ndonnell@redhat.com",
    "parentEntity": "TenantImpl:44WKNggefW9N0ggTtqN2SFuF:FeedHenry Support~support",
    "permissions": [
      "cluster/reseller/customer/domain/project/cloud-apps/endpoint:write",
    ],
    "prefs": {
      "accountType": "enterprise",
      "studio.version": "beta",
      "viewType": "grid"
    },
    "reseller": "t-ub7fDklyz-gwe3oL5DPupH",
    "resellerRoles": [
      "sub"
    ],
    "roles": [
      "sub"
    ],
    "storeItemGroups": [],
    "sub": "pwnqxudinlfdauwnzusa22r2",
    "subscriber": "pwnqxudinlfdauwnzusa22r2",
    "sysCreated": "2017-05-18 11:19:05:966",
    "sysGroupFlags": 65567,
    "sysGroupList": "",
    "sysModified": "2017-08-20 09:19:25:578",
    "sysShardPoint": 3614624646,
    "sysVersion": 16,
    "teams": [
      {
        "_id": "54eefb18faca1f0f7e58b031",
        "business-objects": {
          "cluster": [
            "sam1-core"
          ],
          "cluster/reseller": [
            "t-ub7fDklyz-gwe3oL5DPupH"
          ],
          "cluster/reseller/customer": [
            "44WKNggefW9N0ggTtqN2SFuF"
          ],
          "cluster/reseller/customer/domain": [
            "FoaFm98S9y_7NpNPuNjLVc-3"
          ]
        },
        "code": "default-support-write",
        "defaultTeam": true,
        "desc": null,
        "explain": "",
        "name": "Write Team (support domain)",
        "perms": {
          "cluster/reseller/customer/domain": "write",
          "cluster/reseller/customer/domain/admin/environment": "write"
        },
        "users": [
          "lqd6q6lyo4y4yxc7qrjdpoye",
          "byvdubqw5vn54g5jxglnci5n",
          "47ut4zmkuzqbcx3wdcw4soai",
          "77ismzv4ktidytj777irdawv",
          "npmuu3huf6nmo6q6ylr33qex",
          "6fdbo2qvuojjwbzgegy5f4y6",
          "6yagczdkhyq5ghn5nwymn7r5",
          "uvszze4b55mpju5l5vk7vkuf",
          "efztzkmbuynwdd6ekfkt4ruh",
          "5gyq2xy3nz74fbxty46fioaw",
          "5zvpw7wjrcf2yem2byxztald",
          "pst5mgv47z66dupz6x2y3zpb",
          "tosnjfxfuvqf5t4dqk7gzrlo",
          "tz6m2zan4nl5rlw5m4hmo4fp",
          "25zmxbt3ky2oytmda6uqcuql"
        ]
      },
      {
        "_id": "54eefb175afd8f2a5b44bf25",
        "business-objects": {
          "cluster": [
            "sam1-core"
          ],
          "cluster/reseller": [
            "t-ub7fDklyz-gwe3oL5DPupH"
          ],
          "cluster/reseller/customer": [
            "44WKNggefW9N0ggTtqN2SFuF"
          ]
        },
        "code": "default-44WKNggefW9N0ggTtqN2SFuF-write",
        "defaultTeam": true,
        "desc": null,
        "explain": "",
        "name": "Write Team (FeedHenry Support customer)",
        "perms": {
          "cluster/reseller/customer": "write",
          "cluster/reseller/customer/domain/admin/environment": "write"
        },
        "users": [
          "kGMJwxOu3bLTlytwL2psiT7P",
          "lqd6q6lyo4y4yxc7qrjdpoye",
          "77ismzv4ktidytj777irdawv",
          "wk63pwuys7bsf6vy6lieavb2",
          "gel5oxoafjy5l4r5yc2hf3nk",
          "uvszze4b55mpju5l5vk7vkuf",
          "5gyq2xy3nz74fbxty46fioaw",
          "tz6m2zan4nl5rlw5m4hmo4fp",
          "25zmxbt3ky2oytmda6uqcuql"
        ]
      }
    ],
    "tenant": "44WKNggefW9N0ggTtqN2SFuF",
    "username": "ndonnell@redhat.com"
  },
  "guid": "25zmxbt3ky2oytmda6uqcuql",
  "status": "ok",
  "teams": [
    {
      "_id": "54eefb18faca1f0f7e58b031",
      "business-objects": {
        "cluster": [
          "sam1-core"
        ],
        "cluster/reseller": [
          "t-ub7fDklyz-gwe3oL5DPupH"
        ],
        "cluster/reseller/customer": [
          "44WKNggefW9N0ggTtqN2SFuF"
        ],
        "cluster/reseller/customer/domain": [
          "FoaFm98S9y_7NpNPuNjLVc-3"
        ]
      },
      "code": "default-support-write",
      "defaultTeam": true,
      "desc": null,
      "explain": "",
      "name": "Write Team (support domain)",
      "perms": {
        "cluster/reseller/customer/domain": "write",
        "cluster/reseller/customer/domain/admin/environment": "write"
      },
      "users": [
        "lqd6q6lyo4y4yxc7qrjdpoye",
        "byvdubqw5vn54g5jxglnci5n",
        "47ut4zmkuzqbcx3wdcw4soai",
        "77ismzv4ktidytj777irdawv",
        "npmuu3huf6nmo6q6ylr33qex",
        "6fdbo2qvuojjwbzgegy5f4y6",
        "6yagczdkhyq5ghn5nwymn7r5",
        "uvszze4b55mpju5l5vk7vkuf",
        "efztzkmbuynwdd6ekfkt4ruh",
        "5gyq2xy3nz74fbxty46fioaw",
        "5zvpw7wjrcf2yem2byxztald",
        "pst5mgv47z66dupz6x2y3zpb",
        "tosnjfxfuvqf5t4dqk7gzrlo",
        "tz6m2zan4nl5rlw5m4hmo4fp",
        "25zmxbt3ky2oytmda6uqcuql"
      ]
    },
    {
      "_id": "54eefb175afd8f2a5b44bf25",
      "business-objects": {
        "cluster": [
          "sam1-core"
        ],
        "cluster/reseller": [
          "t-ub7fDklyz-gwe3oL5DPupH"
        ],
        "cluster/reseller/customer": [
          "44WKNggefW9N0ggTtqN2SFuF"
        ]
      },
      "code": "default-44WKNggefW9N0ggTtqN2SFuF-write",
      "defaultTeam": true,
      "desc": null,
      "explain": "",
      "name": "Write Team (FeedHenry Support customer)",
      "perms": {
        "cluster/reseller/customer": "write",
        "cluster/reseller/customer/domain/admin/environment": "write"
      },
      "users": [
        "kGMJwxOu3bLTlytwL2psiT7P",
        "lqd6q6lyo4y4yxc7qrjdpoye",
        "77ismzv4ktidytj777irdawv",
        "wk63pwuys7bsf6vy6lieavb2",
        "gel5oxoafjy5l4r5yc2hf3nk",
        "uvszze4b55mpju5l5vk7vkuf",
        "5gyq2xy3nz74fbxty46fioaw",
        "tz6m2zan4nl5rlw5m4hmo4fp",
        "25zmxbt3ky2oytmda6uqcuql"
      ]
    }
  ],
  "type": "ten_User"
};


var nock = require('nock');
module.exports = nock('https://apps.feedhenry.com')
  .get('/box/srv/1.1/admin/user/list')
  .times(2)
  .reply(200, dataList)
  .post('/box/srv/1.1/admin/user/create')
  .reply(200, {
    "status": "ok",
    "username": "newuser"
  })
  .post('/box/srv/1.1/admin/user/delete')
  .reply(200, data)
  .post('/box/srv/1.1/admin/user/listdevices')
  .reply(200, {})
  .post('/box/srv/1.1/admin/user/liststoreitems')
  .reply(200, {})
  .post('/box/srv/1.1/admin/user/update')
  .times(10)
  .reply(200, data)
  .post('/box/srv/1.1/admin/user/read')
  .times(2)
  .reply(200, data)
  .post('/box/srv/1.1/admin/user/import')
  .reply(200, {"cachekey":"9efe2a98a56eb8e05a5ad09d7bd5213c","status":"ok"});


module.exports = {
  'test admin users list': function(cb) {
    commands.list({}, function(err, data) {
      assert.equal(err, null);
      assert(data);
      var table = data._table;
      assert.equal(table['0'][0], 'Ou3Nt_FRP9cw1ATChbvz57Qv');
      assert.equal(table['0'][1], 'feedhenry-qa.radm@example.com');
      assert.equal(table['0'][2], 'feedhenry-qa.radm@example.com');
      assert.equal(table['0'][3], 'Yes');
      assert.equal(table['0'][4], 'Yes');
      assert.equal(table['0'][5], 'No');
      return cb();
    });
  },
  'test admin users list --json': function(cb) {
    commands.list({json:true}, function(err, data) {
      assert.equal(err, null);
      assert(data);
      assert(!data._table, "Data table is not Expected");
      return cb();
    });
  },
  'test admin users read --json': function(cb) {
    commands.read({json:true}, function(err, data) {
      assert.equal(err, null);
      assert(data);
      assert(!data._table, "Data table is not Expected");
      return cb();
    });
  },
  'test admin users read': function(cb) {
    commands.read({}, function(err, data) {
      assert.equal(err, null);
      assert(data);
      var table = data._table;
      assert.equal(table['0'][0], '25zmxbt3ky2oytmda6uqcuql');
      assert.equal(table['0'][1], 'ndonnell@redhat.com');
      assert.equal(table['0'][2], 'ndonnell@redhat.com');
      assert.equal(table['0'][3], 'Yes');
      assert.equal(table['0'][4], 'Yes');
      assert.equal(table['0'][5], 'No');
      return cb();
    });
  },
  'test admin users create --username --email --json': function(cb) {
    commands.create({username:'newuser', email:'newuser@redhat.com',json:true}, function(err, data) {
      assert.equal(err, null);
      assert(data);
      assert.equal(data.status, 'ok');
      assert(!data._table, "Data table is not Expected");
      return cb();
    });
  },
  'test admin users delete --username --json': function(cb) {
    commands.delete({username:'ndonnell@redhat.com',json:true}, function(err, data) {
      assert.equal(err, null);
      assert(!data._table, "Data table is not Expected");
      return cb();
    });
  },
  'test admin users update --username --email': function(cb) {
    commands.update({username:'ndonnell@redhat.com', email:'ndonnell@redhat.com'}, function(err, data) {
      assert.equal(err, null);
      assert(data);
      var table = data._table;
      assert.equal(table['0'][0], '25zmxbt3ky2oytmda6uqcuql');
      assert.equal(table['0'][1], 'ndonnell@redhat.com');
      assert.equal(table['0'][2], 'ndonnell@redhat.com');
      assert.equal(table['0'][3], 'Yes');
      assert.equal(table['0'][4], 'Yes');
      assert.equal(table['0'][5], 'No');
      return cb();
    });
  },
  'test admin users update --username --email --json': function(cb) {
    commands.update({username:'ndonnell@redhat.com', email:'ndonnell@redhat.com', json:true}, function(err, data) {
      assert.equal(err, null);
      assert(data);
      assert.equal(data.status, 'ok');
      assert(!data._table, "Data table is not Expected");
      return cb();
    });
  },
  'test admin users changeroles --username --roles': function(cb) {
    commands.changeroles({username:'ndonnell@redhat.com', roles:'sub'}, function(err, data) {
      assert.equal(err, null);
      assert(data);
      var table = data._table;
      assert.equal(table['0'][0], '25zmxbt3ky2oytmda6uqcuql');
      assert.equal(table['0'][1], 'ndonnell@redhat.com');
      assert.equal(table['0'][2], 'ndonnell@redhat.com');
      assert.equal(table['0'][3], 'Yes');
      assert.equal(table['0'][4], 'Yes');
      assert.equal(table['0'][5], 'No');
      return cb();
    });
  },
  'test admin users changeroles --username --roles --json': function(cb) {
    commands.changeroles({username:'ndonnell@redhat.com', roles:'sub',json:true}, function(err, data) {
      assert.equal(err, null);
      assert(data);
      assert.equal(data.status, 'ok');
      assert(!data._table, "Data table is not Expected");
      return cb();
    });
  },
  'test admin users changeauthpolicies --username --authpolicies': function(cb) {
    commands.changeauthpolicies({username:'ndonnell@redhat.com', authpolicies:'authpolicies'}, function(err, data) {
      assert.equal(err, null);
      assert(data);
      var table = data._table;
      assert.equal(table['0'][0], '25zmxbt3ky2oytmda6uqcuql');
      assert.equal(table['0'][1], 'ndonnell@redhat.com');
      assert.equal(table['0'][2], 'ndonnell@redhat.com');
      assert.equal(table['0'][3], 'Yes');
      assert.equal(table['0'][4], 'Yes');
      assert.equal(table['0'][5], 'No');
      return cb();
    });
  },
  'test admin users changeauthpolicies --username --authpolicies --json': function(cb) {
    commands.changeauthpolicies({username:'ndonnell@redhat.com', authpolicies:'authpolicies',json:true}, function(err, data) {
      assert.equal(err, null);
      assert(data);
      assert.equal(data.status, 'ok');
      assert(!data._table, "Data table is not Expected");
      return cb();
    });
  },
  'test admin users enable --username ': function(cb) {
    commands.enable({username:'ndonnell@redhat.com'}, function(err, data) {
      assert.equal(err, null);
      assert(data);
      var table = data._table;
      assert.equal(table['0'][0], '25zmxbt3ky2oytmda6uqcuql');
      assert.equal(table['0'][1], 'ndonnell@redhat.com');
      assert.equal(table['0'][2], 'ndonnell@redhat.com');
      assert.equal(table['0'][3], 'Yes');
      assert.equal(table['0'][4], 'Yes');
      assert.equal(table['0'][5], 'No');
      return cb();
    });
  },
  'test admin users enable --username --json': function(cb) {
    commands.enable({username:'ndonnell@redhat.com',json:true}, function(err, data) {
      assert.equal(err, null);
      assert(data);
      assert.equal(data.status, 'ok');
      assert(!data._table, "Data table is not Expected");
      return cb();
    });
  },
  'test admin users disable --username ': function(cb) {
    commands.enable({username:'ndonnell@redhat.com'}, function(err, data) {
      assert.equal(err, null);
      assert(data);
      var table = data._table;
      assert.equal(table['0'][0], '25zmxbt3ky2oytmda6uqcuql');
      assert.equal(table['0'][1], 'ndonnell@redhat.com');
      assert.equal(table['0'][2], 'ndonnell@redhat.com');
      assert.equal(table['0'][3], 'Yes');
      assert.equal(table['0'][4], 'Yes');
      assert.equal(table['0'][5], 'No');
      return cb();
    });
  },
  'test admin users disable --username --json': function(cb) {
    commands.enable({username:'ndonnell@redhat.com',json:true}, function(err, data) {
      assert.equal(err, null);
      assert(data);
      assert.equal(data.status, 'ok');
      assert(!data._table, "Data table is not Expected");
      return cb();
    });
  },
  'test admin users listinstallapps --username ': function(cb) {
    commands.listinstallapps({username:'ndonnell@redhat.com'}, function(err) {
      assert.equal(err, null);
      return cb();
    });
  },
  'test admin users listdevices --username ': function(cb) {
    commands.listdevices({username:'ndonnell@redhat.com'}, function(err) {
      assert.equal(err, null);
      return cb();
    });
  }
};
