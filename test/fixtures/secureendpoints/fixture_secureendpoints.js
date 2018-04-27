var nock = require('nock');
module.exports = nock('https://apps.feedhenry.com')
  .post('/box/srv/1.1/app/endpointsecurity/get')
  .times(4)
  .reply(200, {
    "appId": "1a",
    "default": "appapikey",
    "environment": "dev",
    "overrides": {
      "/hello": {
        "security": "https",
        "updatedBy": "cmacedo@redhat.com",
        "updatedWhen": "Fri Jun 16 11:28:49 UTC 2017"
      }
    },
    "status": "ok",
    "updatedBy": "cmacedo@redhat.com",
    "updatedWhen": "Fri Jun 16 11:28:50 UTC 2017"
  })
  .post('/box/srv/1.1/app/endpointsecurity/auditLog')
  .times(2)
  .reply(200, {
    "list": [
      {
        "appId": "1a",
        "endpoint": "/hello",
        "environment": "dev",
        "event": "Add Endpoint",
        "security": "https",
        "updatedBy": "cmacedo@redhat.com",
        "updatedWhen": "Fri Jun 16 11:28:49 UTC 2017",
        "updatedWhenMillis": 1497612529997
      },
      {
        "appId": "1a",
        "endpoint": "/hello",
        "environment": "dev",
        "event": "Add Endpoint",
        "security": "appapikey",
        "updatedBy": "cmacedo@redhat.com",
        "updatedWhen": "Fri Jun 16 11:28:10 UTC 2017",
        "updatedWhenMillis": 1497612490812
      },
      {
        "appId": "1a",
        "endpoint": "",
        "environment": "dev",
        "event": "Set App Security",
        "security": "appapikey",
        "updatedBy": "cmacedo@redhat.com",
        "updatedWhen": "Fri Jun 16 11:27:59 UTC 2017",
        "updatedWhenMillis": 1497612479418
      }
    ],
    "status": "ok"
  })
  .post('/box/srv/1.1/app/endpointsecurity/removeOverride')
  .reply(200, {
    "appId": "3ukgif3bygcn54fd4sysnkkc",
    "default": "appapikey",
    "environment": "dev",
    "overrides": {},
    "status": "ok"
  })
  .post('/box/srv/1.1/app/endpointsecurity/setOverride')
  .reply(200, {
    "appId": "3ukgif3bygcn54fd4sysnkkc",
    "default": "appapikey",
    "environment": "dev",
    "overrides": {
      "/hello": {
        "security": "https"
      }
    },
    "status": "ok"
  })
  .post('/box/srv/1.1/app/endpointsecurity/setDefault')
  .reply(200, {
    "appId": "3ukgif3bygcn54fd4sysnkkc",
    "default": "appapikey",
    "environment": "dev",
    "overrides": {},
    "status": "ok"
  });
