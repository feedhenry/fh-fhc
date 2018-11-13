var assert = require('assert');
var genericCommand = require('genericCommand');
var cmd = genericCommand(require('cmd/fh3/templates/projects'));

var data = [{
  "id": "pushstarter_project",
  "name": "Push Notification Starter",
  "type": "default",
  "icon": "icon-plane",
  "image": null,
  "description": "An example project using the push server integrated in the Platform",
  "category": "Samples",
  "docs": null,
  "postProcessingOptions": null,
  "appTemplates": [
    {
      "type": "cloud_nodejs",
      "id": "hello_push_mbaas_instance",
      "name": "Cloud App",
      "repoUrl": "git://github.com/feedhenry-templates/hello-push-cloud.git",
      "githubUrl": "https://github.com/feedhenry-templates/hello-push-cloud.git",
      "repoBranch": "refs/heads/FH-v3.17.1",
      "icon": "icon-cloud",
      "image": null,
      "description": "Hello World Push Notification example",
      "category": "Sample Apps",
      "priority": 0.02,
      "docs": "/fhtemplateapps/static/hello_push_mbaas_instance/README.md",
      "initaliseRepo": true,
      "selected": true,
      "forcedSelection": true,
      "imported": false,
      "autoDeployOnCreate": null,
      "screenshots": null,
      "configuration": null,
      "postProcessingOptions": null,
      "sdkConfigFilename": "fhconfig.json"
    },
    {
      "type": "client_xamarin",
      "id": "pushstarter_xamarin_app",
      "name": "Simple Xamarin Push App",
      "repoUrl": "git://github.com/feedhenry-templates/pushstarter-xamarin-app.git",
      "githubUrl": "https://github.com/feedhenry-templates/pushstarter-xamarin-app.git",
      "repoBranch": "refs/heads/FH-v3.17.1",
      "icon": "icon-xamarin",
      "image": null,
      "description": null,
      "category": "Sample Apps",
      "priority": 0,
      "docs": null,
      "initaliseRepo": true,
      "selected": true,
      "forcedSelection": false,
      "imported": false,
      "autoDeployOnCreate": null,
      "screenshots": [
        {
          "url": "/fhtemplateapps/static/pushstarter_xamarin_app/android-push.png"
        }
      ],
      "configuration": null,
      "postProcessingOptions": null,
      "sdkConfigFilename": "fhconfig.*"
    },
    {
      "type": "client_native_android",
      "id": "pushstarter_android_app",
      "name": "Simple Android Push App",
      "repoUrl": "git://github.com/feedhenry-templates/pushstarter-android-app.git",
      "githubUrl": "https://github.com/feedhenry-templates/pushstarter-android-app.git",
      "repoBranch": "refs/heads/FH-v3.17.1",
      "icon": "icon-android",
      "image": null,
      "description": null,
      "category": "Sample Apps",
      "priority": 0,
      "docs": null,
      "initaliseRepo": true,
      "selected": true,
      "forcedSelection": false,
      "imported": false,
      "autoDeployOnCreate": null,
      "screenshots": [
        {
          "url": "/fhtemplateapps/static/pushstarter_android_app/android-push.png"
        }
      ],
      "configuration": null,
      "postProcessingOptions": null,
      "sdkConfigFilename": "fhconfig.properties"
    },
    {
      "type": "client_advanced_hybrid",
      "id": "pushstarter_cordova_app",
      "name": "Simple Cordova Push App",
      "repoUrl": "git://github.com/feedhenry-templates/pushstarter-cordova-app.git",
      "githubUrl": "https://github.com/feedhenry-templates/pushstarter-cordova-app.git",
      "repoBranch": "refs/heads/FH-v3.17.1",
      "icon": "icon-cordova",
      "image": null,
      "description": null,
      "category": "Sample Apps",
      "priority": 0,
      "docs": null,
      "initaliseRepo": true,
      "selected": true,
      "forcedSelection": false,
      "imported": false,
      "autoDeployOnCreate": null,
      "screenshots": [
        {
          "url": "/fhtemplateapps/static/pushstarter_cordova_app/cordova-push.png"
        }
      ],
      "configuration": null,
      "postProcessingOptions": null,
      "sdkConfigFilename": "fhconfig.json"
    },
    {
      "type": "client_native_ios",
      "id": "pushstarter_ios_objc-app",
      "name": "Simple iOS (Objective-C) Push App",
      "repoUrl": "git://github.com/feedhenry-templates/pushstarter-ios-app.git",
      "githubUrl": "https://github.com/feedhenry-templates/pushstarter-ios-app.git",
      "repoBranch": "refs/heads/FH-v3.17.1",
      "icon": "icon-apple",
      "image": null,
      "description": null,
      "category": "Sample Apps",
      "priority": 0,
      "docs": null,
      "initaliseRepo": true,
      "selected": true,
      "forcedSelection": false,
      "imported": false,
      "autoDeployOnCreate": null,
      "screenshots": [
        {
          "url": "/fhtemplateapps/static/pushstarter_ios_objc-app/ios-push.png"
        }
      ],
      "configuration": null,
      "postProcessingOptions": null,
      "sdkConfigFilename": "fhconfig.plist"
    },
    {
      "type": "client_native_ios",
      "id": "pushstarter_ios_swift_app",
      "name": "Simple iOS (Swift) Push App",
      "repoUrl": "git://github.com/feedhenry-templates/pushstarter-ios-swift.git",
      "githubUrl": "https://github.com/feedhenry-templates/pushstarter-ios-swift.git",
      "repoBranch": "refs/heads/FH-v3.17.1",
      "icon": "icon-apple",
      "image": null,
      "description": null,
      "category": "Sample Apps",
      "priority": 0,
      "docs": null,
      "initaliseRepo": true,
      "selected": true,
      "forcedSelection": false,
      "imported": false,
      "autoDeployOnCreate": null,
      "screenshots": [
        {
          "url": "/fhtemplateapps/static/pushstarter_ios_swift_app/ios-push.png"
        }
      ],
      "configuration": null,
      "postProcessingOptions": null,
      "sdkConfigFilename": "fhconfig.plist"
    }
  ],
  "configuration": null,
  "screenshots": [],
  "priority": 0.96
},
  {
    "id": "sync_project",
    "name": "Sync Framework Project",
    "type": "default",
    "icon": "icon-refresh",
    "image": null,
    "description": "An example Project using our Sync framework",
    "category": "Samples",
    "docs": null,
    "postProcessingOptions": null,
    "appTemplates": [
      {
        "type": "cloud_nodejs",
        "id": "sync_cloud",
        "name": "Sync Cloud App",
        "repoUrl": "git://github.com/feedhenry-templates/sync-cloud.git",
        "githubUrl": "https://github.com/feedhenry-templates/sync-cloud.git",
        "repoBranch": "refs/heads/FH-v3.17.1",
        "icon": "icon-cloud",
        "image": null,
        "description": null,
        "category": "Sample Apps",
        "priority": 0,
        "docs": "/fhtemplateapps/static/sync_cloud/README.md",
        "initaliseRepo": true,
        "selected": true,
        "forcedSelection": true,
        "imported": false,
        "autoDeployOnCreate": null,
        "screenshots": null,
        "configuration": null,
        "postProcessingOptions": null,
        "sdkConfigFilename": "fhconfig.json"
      },
      {
        "type": "client_advanced_hybrid",
        "id": "sync_app",
        "name": "Sync App",
        "repoUrl": "git://github.com/feedhenry-templates/sync-cordova-app.git",
        "githubUrl": "https://github.com/feedhenry-templates/sync-cordova-app.git",
        "repoBranch": "refs/heads/FH-v3.17.1",
        "icon": "icon-cordova",
        "image": null,
        "description": null,
        "category": "Sample Apps",
        "priority": 0,
        "docs": null,
        "initaliseRepo": true,
        "selected": true,
        "forcedSelection": false,
        "imported": false,
        "autoDeployOnCreate": null,
        "screenshots": [
          {
            "url": "/fhtemplateapps/static/sync_app/cordova-sync.png"
          }
        ],
        "configuration": null,
        "postProcessingOptions": null,
        "sdkConfigFilename": "fhconfig.json"
      },
      {
        "type": "client_native_ios",
        "id": "sync_ios_objectivec_app",
        "name": "Sync iOS (Objective-C) App",
        "repoUrl": "git://github.com/feedhenry-templates/sync-ios-app.git",
        "githubUrl": "https://github.com/feedhenry-templates/sync-ios-app.git",
        "repoBranch": "refs/heads/FH-v3.17.1",
        "icon": "icon-apple",
        "image": null,
        "description": null,
        "category": "Sample Apps",
        "priority": 0,
        "docs": null,
        "initaliseRepo": true,
        "selected": true,
        "forcedSelection": false,
        "imported": false,
        "autoDeployOnCreate": null,
        "screenshots": [
          {
            "url": "/fhtemplateapps/static/sync_ios_objectivec_app/ios-sync.png"
          }
        ],
        "configuration": null,
        "postProcessingOptions": null,
        "sdkConfigFilename": "fhconfig.plist"
      },
      {
        "type": "client_native_ios",
        "id": "sync_ios_swift_app",
        "name": "Sync iOS (Swift) App",
        "repoUrl": "git://github.com/feedhenry-templates/sync-ios-swift.git",
        "githubUrl": "https://github.com/feedhenry-templates/sync-ios-swift.git",
        "repoBranch": "refs/heads/FH-v3.17.1",
        "icon": "icon-apple",
        "image": null,
        "description": null,
        "category": "Sample Apps",
        "priority": 0,
        "docs": null,
        "initaliseRepo": true,
        "selected": true,
        "forcedSelection": false,
        "imported": false,
        "autoDeployOnCreate": null,
        "screenshots": [
          {
            "url": "/fhtemplateapps/static/sync_ios_swift_app/ios-sync.png"
          }
        ],
        "configuration": null,
        "postProcessingOptions": null,
        "sdkConfigFilename": "fhconfig.plist"
      },
      {
        "type": "client_native_android",
        "id": "sync_android_app",
        "name": "Sync Android App",
        "repoUrl": "git://github.com/feedhenry-templates/sync-android-app.git",
        "githubUrl": "https://github.com/feedhenry-templates/sync-android-app.git",
        "repoBranch": "refs/heads/FH-v3.17.1",
        "icon": "icon-android",
        "image": null,
        "description": null,
        "category": "Sample Apps",
        "priority": 0,
        "docs": null,
        "initaliseRepo": true,
        "selected": true,
        "forcedSelection": false,
        "imported": false,
        "autoDeployOnCreate": null,
        "screenshots": [
          {
            "url": "/fhtemplateapps/static/sync_android_app/android-sync.png"
          }
        ],
        "configuration": null,
        "postProcessingOptions": null,
        "sdkConfigFilename": "fhconfig.properties"
      },
      {
        "type": "client_native_windowsuniversal",
        "id": "sync_windows_app",
        "name": "Sync Windows App",
        "repoUrl": "git://github.com/feedhenry-templates/sync-windows-app.git",
        "githubUrl": "https://github.com/feedhenry-templates/sync-windows-app.git",
        "repoBranch": "refs/heads/FH-v3.17.1",
        "icon": "icon-windows8",
        "image": null,
        "description": null,
        "category": "Sample Apps",
        "priority": 0,
        "docs": null,
        "initaliseRepo": true,
        "selected": true,
        "forcedSelection": false,
        "imported": false,
        "autoDeployOnCreate": null,
        "screenshots": [
          {
            "url": "/fhtemplateapps/static/sync_windows_app/windows-sync.png"
          }
        ],
        "configuration": null,
        "postProcessingOptions": null,
        "sdkConfigFilename": "fhconfig.json"
      },
      {
        "type": "client_xamarin",
        "id": "sync_xamarin_app",
        "name": "Sync Xamarin App",
        "repoUrl": "git://github.com/feedhenry-templates/sync-xamarin-app.git",
        "githubUrl": "https://github.com/feedhenry-templates/sync-xamarin-app.git",
        "repoBranch": "refs/heads/FH-v3.17.1",
        "icon": "icon-xamarin",
        "image": null,
        "description": null,
        "category": "Sample Apps",
        "priority": 0,
        "docs": null,
        "initaliseRepo": true,
        "selected": true,
        "forcedSelection": false,
        "imported": false,
        "autoDeployOnCreate": null,
        "screenshots": [
          {
            "url": "/fhtemplateapps/static/sync_xamarin_app/android-sync.png"
          }
        ],
        "configuration": null,
        "postProcessingOptions": null,
        "sdkConfigFilename": "fhconfig.*"
      }
    ],
    "configuration": null,
    "screenshots": [],
    "priority": 0.41
  }];

var nock = require('nock');
module.exports = nock('https://apps.feedhenry.com')
  .get('/box/api/templates/projects')
  .times(3)
  .reply(200, data);

module.exports = {
  'test fhc templates projects': function(cb) {
    cmd({}, function(err, data) {
      assert.equal(err, null);
      var table = data._table;
      assert.equal(table['0'][0], 'pushstarter_project');
      assert.equal(table['0'][1], 'Push Notification Starter');
      assert.equal(table['0'][2], 'default');
      assert.equal(table['0'][3], 'Samples');
      return cb();
    });
  },
  'test fhc templates projects --id': function(cb) {
    cmd({id:"sync_project"}, function(err, data) {
      assert.equal(err, null);
      var table = data._table;
      assert.equal(table['0'][0], 'sync_project');
      return cb();
    });
  },
  'test fhc templates projects --json': function(cb) {
    cmd({json:true}, function(err, data) {
      assert.equal(err, null);
      assert(!data._table, "Data table is not Expected");
      assert.equal(data[0].id, 'pushstarter_project');
      return cb();
    });
  }
};