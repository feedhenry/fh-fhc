var assert = require('assert');
var genericCommand = require('genericCommand');
var cmd = genericCommand(require('cmd/fh3/templates/services'));

var data = [{
  "id": "mysql",
  "name": "MySQL Connector",
  "type": "other",
  "icon": null,
  "image": "public/img/cloud_plugins/mysql.png",
  "description": "A service for integrating with MySQL",
  "category": "Database",
  "docs": "/fhtemplateapps/static/mysql/README.md",
  "postProcessingOptions": null,
  "appTemplates": [
    {
      "type": "cloud_nodejs",
      "id": "mysql-cloud",
      "name": "MySQL Connector",
      "repoUrl": "git://github.com/feedhenry-templates/fh-connector-mysql-cloud.git",
      "githubUrl": "https://github.com/feedhenry-templates/fh-connector-mysql-cloud.git",
      "repoBranch": "refs/heads/FH-v3.17.1",
      "icon": null,
      "image": "public/img/cloud_plugins/mysql.png",
      "description": null,
      "category": "Database",
      "priority": 0,
      "docs": "/fhtemplateapps/static/mysql-cloud/README.md",
      "initaliseRepo": true,
      "selected": true,
      "forcedSelection": true,
      "imported": false,
      "autoDeployOnCreate": null,
      "screenshots": null,
      "configuration": [
        {
          "desc": "MySQL Database Host",
          "varName": "MYSQL_HOST"
        },
        {
          "desc": "MySQL Username",
          "varName": "MYSQL_USERNAME"
        },
        {
          "desc": "MySQL Password",
          "field": "password",
          "varName": "MYSQL_PASSWORD"
        }
      ],
      "postProcessingOptions": null,
      "sdkConfigFilename": "fhconfig.json"
    }
  ],
  "configuration": null,
  "screenshots": null,
  "priority": 0.897
},{
  "id": "status-monitor",
  "name": "Status Monitor Service",
  "type": "other",
  "icon": null,
  "image": "/fhtemplateapps/static/status-monitor/icon.png",
  "description": "A service for monitoring the status of connectivity from Feed Henry to your remote end-points.",
  "category": "Monitoring",
  "docs": "/fhtemplateapps/static/status-monitor/README.md",
  "postProcessingOptions": null,
  "appTemplates": [
    {
      "type": "cloud_nodejs",
      "id": "fh-status-monitor",
      "name": "Status Monitor",
      "repoUrl": "git://github.com/feedhenry-templates/fh-health-monitor.git",
      "githubUrl": "https://github.com/feedhenry-templates/fh-health-monitor.git",
      "repoBranch": "refs/heads/FH-v3.17.1",
      "icon": null,
      "image": "/fhtemplateapps/static/fh-status-monitor/icon.png",
      "description": null,
      "category": "Monitoring",
      "priority": 0,
      "docs": "/fhtemplateapps/static/fh-status-monitor/README.md",
      "initaliseRepo": true,
      "selected": true,
      "forcedSelection": true,
      "imported": false,
      "autoDeployOnCreate": null,
      "screenshots": null,
      "configuration": [],
      "postProcessingOptions": null,
      "sdkConfigFilename": "fhconfig.json"
    }
  ],
  "configuration": null,
  "screenshots": null,
  "priority": 0.891
}];

var nock = require('nock');
module.exports = nock('https://apps.feedhenry.com')
  .get('/box/api/templates/connectors')
  .times(3)
  .reply(200, data);

module.exports = {
  'test fhc templates services': function(cb) {
    cmd({}, function(err, data) {
      assert.equal(err, null);
      var table = data._table;
      assert.equal(table['0'][0], 'mysql');
      assert.equal(table['0'][1], 'MySQL Connector');
      assert.equal(table['0'][2], 'Database');
      return cb();
    });
  },
  'test fhc templates services --id': function(cb) {
    cmd({id:"status-monitor"}, function(err, data) {
      assert.equal(err, null);
      var table = data._table;
      assert.equal(table['0'][0], 'status-monitor');
      assert.equal(table['0'][1], 'Status Monitor Service');
      assert.equal(table['0'][2], 'Monitoring');
      return cb();
    });
  },
  'test fhc templates services --json': function(cb) {
    cmd({json:true}, function(err, data) {
      assert.equal(err, null);
      assert(!data._table, "Data table is not Expected");
      assert.equal(data[0].id, 'mysql');
      return cb();
    });
  }
};