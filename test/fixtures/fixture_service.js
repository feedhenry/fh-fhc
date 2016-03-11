module.exports = {
  get: function () {
    return {
      "type": "CONNECTOR",
      "template": null,
      "guid": "someserviceguid",
      "title": "Mock Service",
      "sysOwner": "yibx7zf6egqqkge3skqttjhv",
      "sysModified": 1458044450173,
      "sysVersion": 30,
      "featured": false,
      "sysCreated": 1458040959170,
      "apps": [{
        "scmCacheKey": null,
        "hierarchy": null,
        "type": "cloud_nodejs",
        "description": "",
        "domain": "testing",
        "runtime": {
          "test": "node010",
          "dev": "node010",
          "multinode": "node010",
          "live": "node010"
        },
        "template": null,
        "email": "testing-admin@example.com",
        "guid": "someserviceid",
        "title": "testds",
        "sysOwner": "yibx7zf6egqqkge3skqttjhv",
        "sysModified": 1458044450180,
        "legacy": false,
        "gitRefs": {},
        "sysVersion": 28,
        "sourcePath": "",
        "embed": false,
        "gitApp": true,
        "deployedGitRefs": {
          "test": {
            "type": "branch",
            "value": "master",
            "hash": "05b987f5045bf4868e3872ed2abe4ce3a48fab14"
          },
          "dev": {
            "type": "branch",
            "value": "master",
            "hash": "05b987f5045bf4868e3872ed2abe4ce3a48fab14"
          },
          "multinode": {
            "type": "branch",
            "value": "master",
            "hash": "05b987f5045bf4868e3872ed2abe4ce3a48fab14"
          },
          "live": {
            "type": "branch",
            "value": "master",
            "hash": "05b987f5045bf4868e3872ed2abe4ce3a48fab14"
          }
        },
        "sysCreated": 1458040959184,
        "scmUrl": "git@ndonnellycore-single-node1.feedhenry.local:testing/testds-testds.git",
        "scmKey": null,
        "scmBranch": "master",
        "internallyHostedRepo": true,
        "client": false,
        "newApp": false,
        "targetable": true,
        "apiKey": "d42d04e00cbb09a0e35a34ce9cd219d3fa928066",
        "windowsPhonePushInformation": null,
        "androidPushInformation": null,
        "iOSPushInformation": null,
        "sysGroupFlags": 70111,
        "sysGroupList": "",
        "deployable": true,
        "envsToDeployOnCreate": [{
          "propType": "autodeploy.update",
          "environment": "*",
          "deployEnabled": false,
          "propKey": "autodeploy.update.*",
          "propValue": {
            "environment": "*",
            "deployEnabled": false
          }
        }],
        "envsToDeployOnUpdate": [{
          "propType": "autodeploy.update",
          "environment": "test",
          "deployEnabled": false,
          "propKey": "autodeploy.update.test",
          "propValue": {
            "environment": "test",
            "deployEnabled": false
          }
        }, {
          "propType": "autodeploy.update",
          "environment": "dev",
          "deployEnabled": false,
          "propKey": "autodeploy.update.dev",
          "propValue": {
            "environment": "dev",
            "deployEnabled": false
          }
        }, {
          "propType": "autodeploy.update",
          "environment": "multinode",
          "deployEnabled": false,
          "propKey": "autodeploy.update.multinode",
          "propValue": {
            "environment": "multinode",
            "deployEnabled": false
          }
        }, {
          "propType": "autodeploy.update",
          "environment": "live",
          "deployEnabled": false,
          "propKey": "autodeploy.update.live",
          "propValue": {
            "environment": "live",
            "deployEnabled": false
          }
        }],
        "businessObject": "cluster/reseller/customer/domain/service/cloud-apps",
        "initialisedFromTemplate": "true",
        "migrated": false,
        "internallyHostedRepoUrl": "git@git.ndonnellytest.skunkhenry.com:testing/testds-testds.git",
        "internallyHostedRepoName": "testds-testds",
        "pushInfo": {},
        "openshift": null,
        "openshift3": null,
        "scmCommit": "05b987f5045bf4868e3872ed2abe4ce3a48fab14",
        "hasOwnDb": {
          "test": false,
          "dev": false,
          "multinode": false,
          "live": false
        },
        "wrapperModule": {
          "test": "fh-nodeapp",
          "dev": "fh-nodeapp",
          "multinode": "fh-nodeapp",
          "live": "fh-nodeapp"
        },
        "sourcePathConfigurable": false,
        "previewable": false,
        "buildable": false
      }],
      "authorEmail": "testing-admin@example.com",
      "sysGroupFlags": 70111,
      "sysGroupList": "",
      "businessObject": "cluster/reseller/customer/domain/service",
      "migrated": false,
      "templateId": "other",
      "jsonTemplateId": "datasource_static",
      "service": true
    }
  }
};
