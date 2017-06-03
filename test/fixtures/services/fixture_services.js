
var nock = require('nock');

var serviceFixtures = require('./fixture_service');
var dataSourceFixtures = require('../appforms/fixture_data_source');
var mockService = serviceFixtures.get();
var mockDataSource = dataSourceFixtures.get();

var allServices = [{
  "type": "CONNECTOR",
  "description": "",
  "authorEmail": "feedhenry-support.cadm@example.com",
  "template": null,
  "sysGroupFlags": 65695,
  "sysGroupList": "",
  "businessObject": "cluster/reseller/customer/domain/service",
  "sysVersion": 5,
  "sysOwner": "EMvKg9aXbyBpvMS9jjd7KJdV",
  "sysCreated": 1496112667241,
  "templateId": "other",
  "jsonTemplateId": "new-service",
  "service": true,
  "featured": false,
  "migrated": false,
  "guid": "75opvwvrc7w3l45rcrowjpnj",
  "title": "NewTest",
  "sysModified": 1496112680136,
  "apps": [
    {
      "scmCacheKey": null,
      "hierarchy": null,
      "type": "cloud_nodejs",
      "description": "",
      "domain": "support",
      "deployable": true,
      "envsToDeployOnCreate": [],
      "envsToDeployOnUpdate": [],
      "template": null,
      "sysGroupFlags": 65695,
      "sysGroupList": "",
      "businessObject": "cluster/reseller/customer/domain/service/cloud-apps",
      "sysVersion": 3,
      "sysOwner": "EMvKg9aXbyBpvMS9jjd7KJdV",
      "sysCreated": 1496112667267,
      "email": "feedhenry-support.cadm@example.com",
      "sourcePath": "",
      "initialisedFromTemplate": "true",
      "migrated": false,
      "internallyHostedRepoUrl": "git@git.us.feedhenry.com:support/NewTest-NewTest-2.git",
      "apiKey": "90b449ec0f604eb4ac18e44f00cf9df5be65b6",
      "internallyHostedRepoName": "NewTest-NewTest-2",
      "pushInfo": {},
      "guid": "75opvwukoapbtg2eft27xsnc",
      "title": "NewTest",
      "legacy": false,
      "gitRefs": {},
      "sysModified": 1496112680178,
      "embed": false,
      "gitApp": true,
      "deployedGitRefs": {
        "dev": {
          "type": "branch",
          "value": "master",
          "hash": "c1ac9b75389e8a439c52b10dfd91502ac0943027"
        }
      },
      "scmUrl": "git@git.us.feedhenry.com:support/NewTest-NewTest-2.git",
      "scmKey": null,
      "scmBranch": "master",
      "internallyHostedRepo": true,
      "client": false,
      "newApp": false,
      "windowsPhonePushInformation": null,
      "androidPushInformation": null,
      "iOSPushInformation": null,
      "targetable": true,
      "openshift": null,
      "openshift3": null,
      "scmCommit": "c1ac9b75389e8a439c52b10dfd91502ac0943027",
      "hasOwnDb": {
        "openshift": false,
        "dev": false,
        "sp1-openshift": false,
        "live": false
      },
      "wrapperModule": {
        "openshift": "fh-nodeapp",
        "dev": "fh-nodeapp",
        "sp1-openshift": "fh-nodeapp",
        "live": "fh-nodeapp"
      },
      "sourcePathConfigurable": false,
      "previewable": false,
      "buildable": false,
      "runtime": {
        "openshift": null,
        "dev": "node010",
        "sp1-openshift": null,
        "live": null
      }
    }
  ]
},
  {
    "type": "CONNECTOR",
    "description": "",
    "authorEmail": "feedhenry-support.cadm@example.com",
    "template": null,
    "sysGroupFlags": 65695,
    "sysGroupList": "",
    "businessObject": "cluster/reseller/customer/domain/service",
    "sysVersion": 5,
    "sysOwner": "EMvKg9aXbyBpvMS9jjd7KJdV",
    "sysCreated": 1496112617882,
    "templateId": "other",
    "jsonTemplateId": "new-service",
    "service": true,
    "featured": false,
    "migrated": false,
    "guid": "wbhxd3iy76rdzck5duhujg6k",
    "title": "NewTest",
    "sysModified": 1496112632255,
    "apps": [
      {
        "scmCacheKey": null,
        "hierarchy": null,
        "type": "cloud_nodejs",
        "description": "",
        "domain": "support",
        "deployable": true,
        "envsToDeployOnCreate": [],
        "envsToDeployOnUpdate": [],
        "template": null,
        "sysGroupFlags": 65695,
        "sysGroupList": "",
        "businessObject": "cluster/reseller/customer/domain/service/cloud-apps",
        "sysVersion": 3,
        "sysOwner": "EMvKg9aXbyBpvMS9jjd7KJdV",
        "sysCreated": 1496112617921,
        "email": "feedhenry-support.cadm@example.com",
        "sourcePath": "",
        "initialisedFromTemplate": "true",
        "migrated": false,
        "internallyHostedRepoUrl": "git@git.us.feedhenry.com:support/NewTest-NewTest-1.git",
        "apiKey": "7d07208d384ca32dde308cb243513b4b6f0f3e36",
        "internallyHostedRepoName": "NewTest-NewTest-1",
        "pushInfo": {},
        "guid": "wbhxd3ifknd2w3l2m454hnab",
        "title": "NewTest",
        "legacy": false,
        "gitRefs": {},
        "sysModified": 1496112632286,
        "embed": false,
        "gitApp": true,
        "deployedGitRefs": {
          "dev": {
            "type": "branch",
            "value": "master",
            "hash": "18be4f5724260fbd2b9a44edca80f13096fadec5"
          }
        },
        "scmUrl": "git@git.us.feedhenry.com:support/NewTest-NewTest-1.git",
        "scmKey": null,
        "scmBranch": "master",
        "internallyHostedRepo": true,
        "client": false,
        "newApp": false,
        "windowsPhonePushInformation": null,
        "androidPushInformation": null,
        "iOSPushInformation": null,
        "targetable": true,
        "openshift": null,
        "openshift3": null,
        "scmCommit": "18be4f5724260fbd2b9a44edca80f13096fadec5",
        "hasOwnDb": {
          "openshift": false,
          "dev": false,
          "sp1-openshift": false,
          "live": false
        },
        "wrapperModule": {
          "openshift": "fh-nodeapp",
          "dev": "fh-nodeapp",
          "sp1-openshift": "fh-nodeapp",
          "live": "fh-nodeapp"
        },
        "sourcePathConfigurable": false,
        "previewable": false,
        "buildable": false,
        "runtime": {
          "openshift": null,
          "dev": "node010",
          "sp1-openshift": null,
          "live": null
        }
      }
    ]
  }
];

module.exports = nock('https://apps.feedhenry.com')
  .get('/box/api/connectors/')
  .reply(200, allServices)
  .put('/box/api/connectors/2a')
  .reply(200, mockService)
  .get('/box/api/connectors/2a')
  .reply(200, mockService)
  .get('/box/api/connectors/1a')
  .reply(200, mockService)
  .get('/box/api/connectors/' + mockService.guid)
  .reply(200, mockService)
  .get('/api/v2/services/' + mockService.apps[0].guid + '/data_sources')
  .reply(200, [mockDataSource])
  .delete('/box/api/connectors/' + mockService.guid)
  .reply(200, mockService);

