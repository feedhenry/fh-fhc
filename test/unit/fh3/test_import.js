var assert = require('assert');
var genericCommand = require('genericCommand');
var cmd = genericCommand(require('cmd/fh3/import'));

var nock = require('nock');
var dataGit = {
  "scmCacheKey": "4bbebdf4a74b61d0a715aa5fc4cba6e2",
  "hierarchy": null,
  "type": "client_advanced_hybrid",
  "description": "",
  "domain": "support",
  "sysOwner": "i4ze7ruomd27wnohth22to4v",
  "scmUrl": "git@git.us.feedhenry.com:support/NewHelloTest-test-5.git",
  "scmKey": null,
  "scmBranch": "master",
  "internallyHostedRepo": true,
  "sysGroupFlags": 65567,
  "sysGroupList": "",
  "businessObject": "cluster/reseller/customer/domain/project/client-apps",
  "sysVersion": 1,
  "sysCreated": 1499343176760,
  "deployedGitRefs": {},
  "embed": false,
  "apiKey": "75fa35908661594a8fe9515361d1b05144343d84",
  "windowsPhonePushInformation": null,
  "androidPushInformation": null,
  "iOSPushInformation": null,
  "targetable": false,
  "guid": "usqzucpbopqinrt3c5zzjwnm",
  "title": "test",
  "newApp": true,
  "template": null,
  "email": "cmacedo@redhat.com",
  "client": true,
  "gitApp": true,
  "sysModified": 1499343178164,
  "legacy": false,
  "gitRefs": {},
  "sourcePath": "www",
  "deployable": false,
  "envsToDeployOnCreate": [],
  "envsToDeployOnUpdate": [],
  "initialisedFromTemplate": "false",
  "migrated": false,
  "internallyHostedRepoUrl": "git@git.us.feedhenry.com:support/NewHelloTest-test-5.git",
  "internallyHostedRepoName": "NewHelloTest-test-5",
  "pushInfo": {},
  "openshift": null,
  "openshift3": null,
  "scmCommit": null,
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
  "sourcePathConfigurable": true,
  "previewable": true,
  "buildable": true,
  "runtime": {
    "openshift": null,
    "dev": null,
    "sp1-openshift": null,
    "live": null
  }
};

var dataZip = {"scmCacheKey":"b8966064505334edc683e0c89de554de","hierarchy":null,"type":"client_advanced_hybrid","description":"","domain":"support","sysGroupFlags":65567,"sysGroupList":"","businessObject":"cluster/reseller/customer/domain/project/client-apps","sysVersion":1,"sysOwner":"i4ze7ruomd27wnohth22to4v","sysCreated":1499343255773,"deployable":false,"envsToDeployOnCreate":[],"envsToDeployOnUpdate":[],"sourcePath":"www","initialisedFromTemplate":"true","migrated":false,"internallyHostedRepoUrl":"git@git.us.feedhenry.com:support/NewHelloTest-testZip-4.git","apiKey":"e34b554cffb377b81502b940df0146b2e3ebd0e8","internallyHostedRepoName":"NewHelloTest-testZip-4","template":null,"email":"cmacedo@redhat.com","pushInfo":{},"guid":"usqzucjs23n3zbij6czfetl6","title":"testZip","legacy":false,"gitRefs":{},"sysModified":1499343257161,"embed":false,"gitApp":true,"deployedGitRefs":{},"scmUrl":"git@git.us.feedhenry.com:support/NewHelloTest-testZip-4.git","scmKey":null,"scmBranch":"master","internallyHostedRepo":true,"client":true,"newApp":true,"windowsPhonePushInformation":null,"androidPushInformation":null,"iOSPushInformation":null,"targetable":false,"openshift":null,"openshift3":null,"scmCommit":null,"hasOwnDb":{"openshift":false,"dev":false,"sp1-openshift":false,"live":false},"wrapperModule":{"openshift":"fh-nodeapp","dev":"fh-nodeapp","sp1-openshift":"fh-nodeapp","live":"fh-nodeapp"},"sourcePathConfigurable":true,"previewable":true,"buildable":true,"runtime":{"openshift":null,"dev":null,"sp1-openshift":null,"live":null}};
var pathZipFile = 'test/fixtures/import/ios-7.0-2-CordovaApp-src.zip';

module.exports = nock('https://apps.feedhenry.com')
  .post('box/api/projects/usqzucpwydegcjhphznrjstl/apps')
  .reply(200, dataZip)
  .post('box/api/projects/usqzucpwydegcjhphznrjstl/apps')
  .reply(200, dataGit);

module.exports = {
  'test import --project=<project> --title=<title> --template=<template> --zipFile=<zipFile>': function(cb) {
    cmd({project:"usqzucpwydegcjhphznrjstl", title:"testZip", template:"client_advanced_hybrid", zipFile:pathZipFile}, function(err, data) {
      assert.equal(err, null);
      assert.equal(data.scmCacheKey,"b8966064505334edc683e0c89de554de");
      return cb();
    });
  },
  'test import --project=<project> --title=<title> --template=<template> --gitRepo=<gitRepo>': function(cb) {
    cmd({project:"usqzucpwydegcjhphznrjstl", title:"testZip", template:"client_advanced_hybrid", gitRepo:"git@git.us.feedhenry.com:support/NewHelloTest-Cordova-App.git"}, function(err, data) {
      assert.equal(err, null);
      assert.equal(data.scmCacheKey,"4bbebdf4a74b61d0a715aa5fc4cba6e2");
      return cb();
    });
  }
};