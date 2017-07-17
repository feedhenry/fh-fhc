var assert = require('assert');
var genericCommand = require('genericCommand');

var itemGroupsCmd = {
  read: genericCommand(require('cmd/fh3/admin/appstore/itemgroups/read')),
  create: genericCommand(require('cmd/fh3/admin/appstore/itemgroups/create')),
  list: genericCommand(require('cmd/fh3/admin/appstore/itemgroups/list')),
  delete: genericCommand(require('cmd/fh3/admin/appstore/itemgroups/delete')),
  readByName: genericCommand(require('cmd/fh3/admin/appstore/itemgroups/readByName')),
  update: genericCommand(require('cmd/fh3/admin/appstore/itemgroups/update')),
  usersadd: genericCommand(require('cmd/fh3/admin/appstore/itemgroups/users/add')),
  usersdelete: genericCommand(require('cmd/fh3/admin/appstore/itemgroups/users/delete')),
  itemsadd: genericCommand(require('cmd/fh3/admin/appstore/itemgroups/items/add')),
  itemsdelete: genericCommand(require('cmd/fh3/admin/appstore/itemgroups/items/delete'))
};

var dataItemGroup = {
  "description": "TestGroup",
  "guid": "64oj7wsmt5toh46rl3ni2ltz",
  "name": "TestGroup",
  "status": "ok",
  "storeitems": ['hgzu6zlnlwlf3l5uof3jkyke'],
  "users": []
};

var dataListItemGroup ={
  "count": 2,
  "list": [
    {
      "description": "TestGroup",
      "guid": "64oj7wsmt5toh46rl3ni2ltz",
      "name": "TestGroup"
    },
    {
      "description": "TestCamila",
      "guid": "rrusvdkq3s336qpv3kpmbigw",
      "name": "Test Camila's Team"
    }
  ],
  "status": "ok"
};


var nock = require('nock');

module.exports = nock('https://apps.feedhenry.com')
  .get('/box/srv/1.1/admin/storeitemgroup/list')
  .times(4)
  .reply(200, dataListItemGroup)
  .post('/box/srv/1.1/admin/storeitemgroup/read')
  .times(6)
  .reply(200, dataItemGroup)
  .post('/box/srv/1.1/admin/storeitemgroup/update')
  .times(2)
  .reply(200, dataItemGroup)
  .post('/box/srv/1.1/admin/storeitemgroup/delete')
  .reply(200, {})
  .post('/box/srv/1.1/admin/storeitemgroup/create')
  .times(2)
  .reply(200, dataItemGroup)
  .post('/box/srv/1.1/admin/storeitemgroup/removeusers')
  .reply(200, dataItemGroup)
  .post('/box/srv/1.1/admin/storeitemgroup/addusers')
  .reply(200, dataItemGroup)
  .post('/box/srv/1.1/admin/storeitemgroup/removestoreitems')
  .reply(200, dataItemGroup)
  .post('/box/srv/1.1/admin/storeitemgroup/addstoreitems')
  .reply(200, dataItemGroup);

module.exports = {
  'test fhc admin appstore itemgroups list': function(cb) {
    itemGroupsCmd.list({}, function(err, data) {
      assert.equal(err, null);
      var table = data._table;
      assert.equal(table['0'][0], '64oj7wsmt5toh46rl3ni2ltz');
      assert.equal(table['0'][1], 'TestGroup');
      assert.equal(table['0'][2], 'TestGroup');
      return cb();
    });
  },
  'test fhc admin appstore itemgroups --json': function(cb) {
    itemGroupsCmd.list({json:true}, function(err, data) {
      assert.equal(err, null);
      assert.equal(data._table,null);
      assert.equal(data.status,"ok");
      return cb();
    });
  },
  'test fhc admin appstore itemgroups read --guid': function(cb) {
    itemGroupsCmd.read({guid:'64oj7wsmt5toh46rl3ni2ltz'}, function(err, data) {
      assert.equal(err, null);
      var table = data._table;
      assert.equal(table['0'][0], '64oj7wsmt5toh46rl3ni2ltz');
      assert.equal(table['0'][1], 'TestGroup');
      assert.equal(table['0'][2], 'TestGroup');
      return cb();
    });
  },
  'test fhc admin appstore itemgroups read --guid --json': function(cb) {
    itemGroupsCmd.read({guid:'64oj7wsmt5toh46rl3ni2ltz',json:true}, function(err, data) {
      assert.equal(err, null);
      assert.equal(data._table,null);
      assert.equal(data.status,"ok");
      return cb();
    });
  },
  'test fhc admin appstore itemgroups readByName --name': function(cb) {
    itemGroupsCmd.readByName({name:'TestGroup'}, function(err, data) {
      assert.equal(err, null);
      var table = data._table;
      assert.equal(table['0'][0], '64oj7wsmt5toh46rl3ni2ltz');
      assert.equal(table['0'][1], 'TestGroup');
      assert.equal(table['0'][2], 'TestGroup');
      return cb();
    });
  },
  'test fhc admin appstore itemgroups readByName --name --json': function(cb) {
    itemGroupsCmd.readByName({name:'TestGroup',json:true}, function(err, data) {
      assert.equal(err, null);
      assert.equal(data._table,null);
      assert.equal(data.status,"ok");
      return cb();
    });
  },
  'test fhc admin appstore itemgroups update --guid --name --description': function(cb) {
    itemGroupsCmd.update({guid:'64oj7wsmt5toh46rl3ni2ltz',name:'TestGroup',description:'TestGroup'}, function(err, data) {
      assert.equal(err, null);
      var table = data._table;
      assert.equal(table['0'][0], '64oj7wsmt5toh46rl3ni2ltz');
      assert.equal(table['0'][1], 'TestGroup');
      assert.equal(table['0'][2], 'TestGroup');
      return cb();
    });
  },
  'test fhc admin appstore itemgroups update --guid --name --description --json': function(cb) {
    itemGroupsCmd.update({guid:'64oj7wsmt5toh46rl3ni2ltz',name:'TestGroup',description:'TestGroup',json:true}, function(err, data) {
      assert.equal(err, null);
      assert.equal(data._table,null);
      assert.equal(data.status,"ok");
      return cb();
    });
  },
  'test fhc admin appstore itemgroups create --name --description': function(cb) {
    itemGroupsCmd.create({name:'TestGroup',description:'TestGroup'}, function(err, data) {
      assert.equal(err, null);
      var table = data._table;
      assert.equal(table['0'][0], '64oj7wsmt5toh46rl3ni2ltz');
      assert.equal(table['0'][1], 'TestGroup');
      assert.equal(table['0'][2], 'TestGroup');
      return cb();
    });
  },
  'test fhc admin appstore itemgroups create --name --description --json': function(cb) {
    itemGroupsCmd.create({name:'TestGroup',description:'TestGroup',json:true}, function(err, data) {
      assert.equal(err, null);
      assert.equal(data._table,null);
      assert.equal(data.status,"ok");
      return cb();
    });
  },
  'test fhc admin appstore itemgroups users delete --guid--user --json': function(cb) {
    itemGroupsCmd.usersdelete({guid:'64oj7wsmt5toh46rl3ni2ltz', user:'64oj7wsmt5toh46rl3ni2ltz', json:true}, function(err,data) {
      assert.equal(err, null);
      assert.equal(data._table,null);
      assert.equal(data.status,"ok");
      return cb();
    });
  },
  'test fhc admin appstore itemgroups users add --guid --user --json': function(cb) {
    itemGroupsCmd.usersadd({guid:'64oj7wsmt5toh46rl3ni2ltz', user:'64oj7wsmt5toh46rl3ni2ltz', json:true}, function(err,data) {
      assert.equal(err, null);
      assert.equal(data._table,null);
      assert.equal(data.status,"ok");
      return cb();
    });
  },
  'test fhc admin appstore itemgroups items delete --guid--user --json': function(cb) {
    itemGroupsCmd.itemsdelete({guid:'64oj7wsmt5toh46rl3ni2ltz', item:'64oj7wsmt5toh46rl3ni2ltz', json:true}, function(err,data) {
      assert.equal(err, null);
      assert.equal(data._table,null);
      assert.equal(data.status,"ok");
      return cb();
    });
  },
  'test fhc admin appstore itemgroups items add --guid --user --json': function(cb) {
    itemGroupsCmd.itemsadd({guid:'64oj7wsmt5toh46rl3ni2ltz', item:'64oj7wsmt5toh46rl3ni2ltz', json:true}, function(err,data) {
      assert.equal(err, null);
      assert.equal(data._table,null);
      assert.equal(data.status,"ok");
      return cb();
    });
  }
};