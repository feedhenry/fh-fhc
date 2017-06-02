var nock = require('nock');

module.exports = nock('https://apps.feedhenry.com')
.filteringRequestBody(function() {
  return '*';
})
.post('/box/api/domains', '*')
.reply(200, {
  "signoverUrl": null,
  "host": null,
  "owner": false,
  "parent": null,
  "domain": "test",
  "type": "developer",
  "cookieDomain": "",
  "theme": "",
  "reseller": "t-ub7fDklyz-gwe3oL5DPupH",
  "tenant": "44WKNggefW9N0ggTtqN2SFuF",
  "url": "camila.$hostname",
  "businessObject": "cluster/reseller/customer/domain",
  "sysCreated": 1495576762505,
  "guid": "6x74qr6ca4x7wx62qlw5gc6b",
  "sysModified": 1495576762695,
  "sysVersion": 1,
  "sysOwner": "3pbuu45gn3ynj2r5fu5bynhu",
  "sysGroupFlags": 65567,
  "sysGroupList": ""
})
.get('/box/api/domains/check?domain=testing', '*')
.reply(200, {"available": "true"})
