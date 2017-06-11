var nock = require('nock');

module.exports = nock('https://apps.feedhenry.com')
  .post('/box/srv/1.1/app/eventlog/listEvents')
  .reply(200, [])
  .post('/box/srv/1.1/app/eventlog/listEvents')
  .times(3)
  .reply(200, {
    "count": 10,
    "list": [
      {
        "eventGroup": "NOTIFICATION",
        "fields": {
          "appGuid": "cuke6ultphkoxaulyhpsb6ep",
          "category": "APP_STATE",
          "dismissed": false,
          "env": "dev",
          "eventDetails": {
            "app": {
              "app": "support-cuke6ultphkoxaulyhpsb6ep-dev",
              "appDir": "/opt/feedhenry/fh-dynoman/data/support-dev/home/apps/support-cuke6ultphkoxaulyhpsb6ep-dev",
              "changehash": "20283d4b100a3d409043f3b3228a1259",
              "dyno": "support-dev",
              "dynoDetails": {
                "broadcast": "172.22.0.7",
                "dyno": "support-dev",
                "dynoDir": "/opt/feedhenry/fh-dynoman/data/support-dev/",
                "expectedRunState": "RUNNING",
                "host": "172.22.0.5",
                "limits": {
                  "cpu": "512",
                  "cpuset": "1",
                  "disk": "5120M",
                  "ram": "1024M",
                  "swap": "512M"
                },
                "name": "support-dev",
                "state": "RUNNING",
                "veth": "172.22.0.6"
              },
              "dynoDir": "/opt/feedhenry/fh-dynoman/data/support-dev",
              "expectedRunState": "RUNNING",
              "host": "172.22.0.5",
              "numappinstances": 1,
              "packageHash": "84dcc9932d0576cd7081cea3ffcb12af",
              "port": 8192,
              "running": true,
              "runtime": "node4",
              "state": "RUNNING"
            },
            "dyno": {
              "broadcast": "172.22.0.7",
              "dyno": "support-dev",
              "dynoDir": "/opt/feedhenry/fh-dynoman/data/support-dev/",
              "expectedRunState": "RUNNING",
              "host": "172.22.0.5",
              "limits": {
                "cpu": "512",
                "cpuset": "1",
                "disk": "5120M",
                "ram": "1024M",
                "swap": "512M"
              },
              "name": "support-dev",
              "state": "RUNNING",
              "veth": "172.22.0.6"
            },
            "message": "App started",
            "vm": {}
          },
          "eventType": "START_SUCCESSFUL",
          "guid": "i4v54cybtabwhug5xzjg23o2",
          "message": "App started",
          "severity": "INFO",
          "sysCreated": "2017-06-08 18:47:10:617",
          "timestamp": "2017-06-08 18:47:10:546",
          "title": "START_SUCCESSFUL",
          "uid": "cuke6ultphkoxaulyhpsb6ep",
          "updatedBy": "System"
        },
        "guid": "i4v54cybtabwhug5xzjg23o2",
        "type": "eventlog_EventLog"
      }
    ],
    "status": "ok"
  });
