var assert = require('assert');
var genericCommand = require('genericCommand');

var eventAlertCmd = {
  read: genericCommand(require('cmd/fh3/eventalert/read')),
  list: genericCommand(require('cmd/fh3/eventalert/list')),
  delete: genericCommand(require('cmd/fh3/eventalert/delete')),
  update: genericCommand(require('cmd/fh3/eventalert/update')),
  clone: genericCommand(require('cmd/fh3/eventalert/clone'))
};

var nock = require('nock');
var dataList = {"list":[{"alertName":"clone","emails":"emails@test.com,emails2@test.com","enabled":true,"env":"dev","eventCategories":"APP_STATE,APP_ENVIRONMENT","eventNames":"CRASHED","eventSeverities":"INFO,WARN,ERROR,FATAL","guid":"4ulbq3zkggc5ttzpydneaphv","sysCreated":"2017-07-06 16:30:06","sysModified":"2017-07-06 16:30:06","uid":"7gwbu7lepnxijuyhcxrqtodg"},{"alertName":"NewAlert2","emails":"emails@test.com,emails2@test.com","enabled":true,"env":"dev","eventCategories":"APP_STATE,APP_ENVIRONMENT","eventNames":"CRASHED","eventSeverities":"INFO,WARN,ERROR,FATAL","guid":"jmmizhv3fvg4aqz32iqyqd4p","sysCreated":"2017-07-06 15:56:53","sysModified":"2017-07-06 15:56:53","uid":"7gwbu7lepnxijuyhcxrqtodg"}],"status":"ok"};

module.exports = nock('https://apps.feedhenry.com')
  .get("/api/v2/mbaas/apps/dev/apps/7gwbu7lepnxijuyhcxrqtodg/alerts")
  .times(5)
  .reply(200, dataList)
  .post("/api/v2/mbaas/apps/dev/apps/7gwbu7lepnxijuyhcxrqtodg/alerts")
  .times(4)
  .reply(200, dataList.list[0])
  .put("/api/v2/mbaas/apps/dev/apps/7gwbu7lepnxijuyhcxrqtodg/alerts/4ulbq3zkggc5ttzpydneaphv")
  .reply(200, dataList.list[0])
  .delete("/api/v2/mbaas/apps/dev/apps/7gwbu7lepnxijuyhcxrqtodg/alerts/4ulbq3zkggc5ttzpydneaphv")
  .reply(200, dataList.list[0]);

module.exports = {
  'test fhc eventalert clone --app=<app> --id=<id> --name=<name> --env=<environment> --json': function(cb) {
    eventAlertCmd.clone({app: "7gwbu7lepnxijuyhcxrqtodg", env: "dev", id:"4ulbq3zkggc5ttzpydneaphv", json:true}, function(err, data) {
      assert.equal(err, null);
      assert.ok(!data._table, "Data is not Expected");
      return cb();
    });
  },
  'test fhc eventalert list --app=<app> --id=<id> --env=<environment>': function(cb) {
    eventAlertCmd.list({app: "7gwbu7lepnxijuyhcxrqtodg", env: "dev"}, function(err, data) {
      assert.equal(err, null);
      var table = data._table;
      assert.equal(table['0'][0], '4ulbq3zkggc5ttzpydneaphv');
      assert.equal(table['0'][1], 'clone');
      assert.equal(table['0'][2], 'emails@test.com,emails2@test.com');
      assert.equal(table['0'][3], 'Yes');
      assert.equal(table['0'][4], 'APP_STATE,APP_ENVIRONMENT');
      assert.equal(table['0'][5], 'CRASHED');
      assert.equal(table['0'][6], 'INFO,WARN,ERROR,FATAL');
      return cb();
    });
  },
  'test fhc eventalert list --app=<app> --id=<id> --env=<environment> --json': function(cb) {
    eventAlertCmd.list({app: "7gwbu7lepnxijuyhcxrqtodg", env: "dev", json:true}, function(err, data) {
      assert.equal(err, null);
      assert.ok(!data._table, "Data is not Expected");
      return cb();
    });
  },
  'test fhc eventalert udpate --app=<app> --id=<id> --name=<name> --env=<environment> --json': function(cb) {
    eventAlertCmd.update({app: "7gwbu7lepnxijuyhcxrqtodg", name:"name", env: "dev", id:"4ulbq3zkggc5ttzpydneaphv", json:true}, function(err, data) {
      assert.equal(err, null);
      assert.ok(!data._table, "Data is not Expected");
      return cb();
    });
  },
  'test fhc eventalert read --app=<app> --id=<id> --env=<environment> --json': function(cb) {
    eventAlertCmd.read({app: "7gwbu7lepnxijuyhcxrqtodg", env: "dev", id:"4ulbq3zkggc5ttzpydneaphv", json:true}, function(err, data) {
      assert.equal(err, null);
      assert.ok(!data._table, "Data is not Expected");
      return cb();
    });
  },
  'test fhc eventalert delete --app=<app> --id=<id> --env=<environment> --json': function(cb) {
    eventAlertCmd.delete({app: "7gwbu7lepnxijuyhcxrqtodg", env: "dev", id:"4ulbq3zkggc5ttzpydneaphv", json:true}, function(err, data) {
      assert.equal(err, null);
      assert.ok(!data._table, "Data is not Expected");
      return cb();
    });
  }
};