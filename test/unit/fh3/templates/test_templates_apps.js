var assert = require('assert');
var genericCommand = require('genericCommand');
var cmd = genericCommand(require('cmd/fh3/templates/apps'));

var data = [{
  "id": "hello_world_hybrid_app",
  "name": "Cordova App",
  "repoUrl": "git://github.com/feedhenry-templates/helloworld-app.git",
  "githubUrl": "https://github.com/feedhenry-templates/helloworld-app.git",
  "repoBranch": "refs/heads/FH-v3.17.1",
  "type": "client_advanced_hybrid",
  "icon": "icon-cordova",
  "image": null,
  "description": "An HTML5 Cordova App which echos your name via the Cloud",
  "category": "Cordova",
  "priority": 0.56,
  "docs": null,
  "initaliseRepo": true,
  "selected": true,
  "forcedSelection": false,
  "imported": false,
  "autoDeployOnCreate": null,
  "screenshots": [
    {
      "url": "/fhtemplateapps/static/hello_world_hybrid_app/1.png"
    },
    {
      "url": "/fhtemplateapps/static/hello_world_hybrid_app/2.png"
    }
  ],
  "configuration": null,
  "postProcessingOptions": null,
  "sdkConfigFilename": "fhconfig.json"
},{
  "id": "blank_advanced_webapp",
  "name": "Blank Web App",
  "repoUrl": "git://github.com/feedhenry/fh-advanced-webapp-blank-app.git",
  "githubUrl": "https://github.com/feedhenry/fh-advanced-webapp-blank-app.git",
  "repoBranch": "refs/heads/FH-v3.17.1",
  "type": "webapp_advanced",
  "icon": "icon-nodejs",
  "image": null,
  "description": "Blank Hello World Web App",
  "category": "Blank Apps",
  "priority": 0.49,
  "docs": null,
  "initaliseRepo": true,
  "selected": false,
  "forcedSelection": false,
  "imported": false,
  "autoDeployOnCreate": null,
  "screenshots": [
    {
      "url": "/fhtemplateapps/static/blank_advanced_webapp/1.png"
    }
  ],
  "configuration": null,
  "postProcessingOptions": null,
  "sdkConfigFilename": "fhconfig.json"
}];

var nock = require('nock');
module.exports = nock('https://apps.feedhenry.com')
  .get('/box/api/templates/apps')
  .times(3)
  .reply(200, data);

module.exports = {
  'test fhc templates apps': function(cb) {
    cmd({}, function(err, data) {
      assert.equal(err, null);
      var table = data._table;
      assert.equal(table['0'][0], 'hello_world_hybrid_app');
      assert.equal(table['0'][1], 'Cordova App');
      assert.equal(table['0'][2], 'client_advanced_hybrid');
      assert.equal(table['0'][3], 'Cordova');
      assert.equal(table['0'][4], 'git://github.com/feedhenry-templates/helloworld-app.git');
      return cb();
    });
  },
  'test fhc templates apps --id': function(cb) {
    cmd({id:"blank_advanced_webapp"}, function(err, data) {
      assert.equal(err, null);
      var table = data._table;
      assert.equal(table['0'][0], 'blank_advanced_webapp');
      return cb();
    });
  },
  'test fhc templates apps --json': function(cb) {
    cmd({json:true}, function(err, data) {
      assert.equal(err, null);
      assert(!data._table, "Data table is not Expected");
      assert.equal(data[0].id, 'hello_world_hybrid_app');
      return cb();
    });
  }
};