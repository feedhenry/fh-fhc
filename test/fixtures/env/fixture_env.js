var nock = require('nock');

var dataList = {
  "count": 2,
  "list": [
    {
      "fields": {
        "appId": "kfzpti2iwmuayfkvqrpjokp2",
        "businessObject": "cluster/reseller/customer/domain/project/cloud-apps/environment-variable",
        "devValue": "test",
        "domain": "support",
        "guid": "cbh5jjpqdojimckeolw5yyib",
        "masked": false,
        "name": "test3",
        "parentEntity": "TemplateInstanceImpl:kfzpti2iwmuayfkvqrpjokp2:1459534139581~kfzpti33ayhjnl3mc77uikf5~support~Cloud App:parentGuid=kfzpti33ayhjnl3mc77uikf5:parentType=widg_Widget",
        "sysCreated": "2017-06-12 00:01:19:551",
        "sysGroupFlags": 65567,
        "sysGroupList": "",
        "sysModified": "2017-06-12 00:01:53:923",
        "sysShardPoint": 273667237,
        "sysVersion": 1
      },
      "guid": "cbh5jjpqdojimckeolw5yyib",
      "type": "cm_CloudEnvVariable"
    },
    {
      "fields": {
        "appId": "kfzpti2iwmuayfkvqrpjokp2",
        "businessObject": "cluster/reseller/customer/domain/project/cloud-apps/environment-variable",
        "devValue": "test",
        "domain": "support",
        "guid": "xxcgtuxzd2n4sgqokhu4ncdy",
        "masked": false,
        "name": "test2",
        "parentEntity": "TemplateInstanceImpl:kfzpti2iwmuayfkvqrpjokp2:1459534139581~kfzpti33ayhjnl3mc77uikf5~support~Cloud App:parentGuid=kfzpti33ayhjnl3mc77uikf5:parentType=widg_Widget",
        "sysCreated": "2017-06-12 00:00:34:068",
        "sysGroupFlags": 65567,
        "sysGroupList": "",
        "sysModified": "2017-06-12 00:00:34:176",
        "sysShardPoint": 3183765970,
        "sysVersion": 1
      },
      "guid": "xxcgtuxzd2n4sgqokhu4ncdy",
      "type": "cm_CloudEnvVariable"
    }
  ],
  "status": "ok"
};

var data = {
  "fields": {
    "appId": "kfzpti2iwmuayfkvqrpjokp2",
    "businessObject": "cluster/reseller/customer/domain/project/cloud-apps/environment-variable",
    "domain": "support",
    "guid": "1a",
    "masked": false,
    "name": "test6",
    "parentEntity": "TemplateInstanceImpl:kfzpti2iwmuayfkvqrpjokp2:1459534139581~kfzpti33ayhjnl3mc77uikf5~support~Cloud App:parentGuid=kfzpti33ayhjnl3mc77uikf5:parentType=widg_Widget",
    "sysCreated": "2017-06-12 00:06:45:024",
    "sysGroupFlags": 65567,
    "sysGroupList": "",
    "sysModified": "2017-06-12 00:16:35:697",
    "sysShardPoint": 2526415568,
    "sysVersion": 4
  },
  "guid": "s2lavucvg4phliyxj6xw6qm7",
  "status": "ok",
  "type": "cm_CloudEnvVariable"
};

module.exports = nock('https://apps.feedhenry.com')
  .post('/box/srv/1.1/app/envvariable/create')
  .reply(200, data)
  .post('/box/srv/1.1/app/envvariable/update')
  .reply(200, data)
  .post('/box/srv/1.1/app/envvariable/listDeployed')
  .reply(200, dataList)
  .post('/box/api/apps/1a/env/dev/envvars/push')
  .reply(200, {
    "message": "",
    "status": "ok",
    "result": null
  })
  .post('/box/srv/1.1/app/envvariable/unset')
  .reply(200, data)
  .post('/box/srv/1.1/app/envvariable/read')
  .times(2)
  .reply(200, data)
  .post('/box/srv/1.1/app/envvariable/list')
  .times(2)
  .reply(200, dataList)
  .post('/box/srv/1.1/app/envvariable/delete')
  .reply(200, data);
