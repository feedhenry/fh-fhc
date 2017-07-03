var nock = require('nock');

var dataList = [{
  "businessObject": "cluster/reseller/customer/domain/project/cloud-apps/environment-variable",
  "domain": "support",
  "varValues": {
    "dev": "test2"
  },
  "varName": "assa",
  "masked": false,
  "appId": "1a",
  "sysGroupFlags": 65567,
  "sysGroupList": "",
  "sysVersion": 13,
  "sysOwner": "i4ze7ruomd27wnohth22to4v",
  "sysCreated": 1497463867382,
  "guid": "2b",
  "sysModified": 1497471323489
},
  {
    "businessObject": "cluster/reseller/customer/domain/project/cloud-apps/environment-variable",
    "domain": "support",
    "varValues": {
      "dev": "valorupdate"
    },
    "varName": "Test2",
    "masked": false,
    "appId": "3ukgif3bygcn54fd4sysnkkc",
    "sysGroupFlags": 65567,
    "sysGroupList": "",
    "sysVersion": 1,
    "sysOwner": "i4ze7ruomd27wnohth22to4v",
    "sysCreated": 1497466411454,
    "guid": "nqnbvq2u3lvmu2xnehvmtpca",
    "sysModified": 1497469701340
  },
  {
    "businessObject": "cluster/reseller/customer/domain/project/cloud-apps/environment-variable",
    "domain": "support",
    "varValues": {},
    "varName": "Test",
    "masked": false,
    "appId": "3ukgif3bygcn54fd4sysnkkc",
    "sysGroupFlags": 65567,
    "sysGroupList": "",
    "sysVersion": 0,
    "sysOwner": "i4ze7ruomd27wnohth22to4v",
    "sysCreated": 1497466373161,
    "guid": "nrbwq2alymveqpbuj5tlzgtl",
    "sysModified": 1497466373167
  }]

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
  .post('/box/api/apps/1a/env/dev/envvars')
  .reply(200, data)
  .put('/box/api/apps/1a/env/dev/envvars/2b')
  .reply(200, data)
  .delete('/box/api/apps/1a/env/dev/envvars/2b')
  .reply(200, {})
  .post('/box/api/apps/1a/env/dev/envvars/push')
  .reply(200, {
    "message": "",
    "status": "ok",
    "result": null
  })
  .get('/box/api/apps/1a/env/dev/envvars')
  .times(3)
  .reply(200, dataList)
  .put('/box/api/apps/1a/env/dev/envvars/2b/unset')
  .reply(200, data)
