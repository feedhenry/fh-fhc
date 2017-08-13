var assert = require('assert');
var genericCommand = require('genericCommand');
var command = genericCommand(require('cmd/fh3/version'));

var dataNpm = {"name":"fh-fhc","description":"A Command Line Interface for FeedHenry","version":"2.18.0-896","_minPlatformVersion":"3.11.0","keywords":["feedhenry"],"preferGlobal":true,"homepage":"https://github.com/feedhenry/fh-fhc","repository":{"type":"git","url":"git+https://github.com/feedhenry/fh-fhc.git"},"author":{"name":"FeedHenry","email":"npm@feedhenry.com"},"bugs":{"url":"https://issues.jboss.org/projects/FH/issues"},"directories":{"lib":"./lib","bin":"./bin","test":"./test"},"main":"./lib/fhc.js","bin":{"fhc":"./bin/fhc.js"},"publishConfig":{"tag":"latest"},"dependencies":{"async":"0.2.9","cheerio":"0.10.8","cli-table":"0.0.2","cli-tree":"0.0.1","colors":"0.6.2","findit":"2.0.0","fstream":"0.1.22","mime":"1.2.9","moment":"2.0.0","node-gettext":"1.1.0","nopt":"1.0.0","once":"^1.3.2","open":"0.0.5","os-locale":"1.4.0","progress":"^1.1.8","request":"2.74.0","semver":"4.3.6","tabtab":"0.0.2","tar":"2.2.1","underscore":"1.8.0","underscore-deep-extend":"0.0.5","unzip":"0.1.7","yargs":"2.1.1"},"devDependencies":{"fs-extra":"0.12.0","grunt":"^0.4.5","grunt-concurrent":"1.0.0","grunt-eslint":"^19.0.0","grunt-fh-build":"^1.0.2","grunt-jsxgettext":"1.0.0","grunt-open":"0.2.3","grunt-plato":"1.0.0","grunt-shell":"0.6.4","grunt-zanata-js":"1.1.0","istanbul":"0.2.7","jsxgettext":"0.8.2","load-grunt-tasks":"0.4.0","nock":"8.0.0","proxyquire":"0.4.1","time-grunt":"0.3.1","turbo-test-runner":"0.3.3"},"engines":{"node":">=4.4"},"scripts":{"test":"grunt test"},"license":"MIT","_id":"fh-fhc@2.18.0-896","_shasum":"50d5903d5b6124853d18871f2d42db6b4b0f6ab9","_resolved":"file:fh-fhc-2.18.0-896.tar.gz","_from":"fh-fhc-2.18.0-896.tar.gz","_npmVersion":"2.15.2","_nodeVersion":"4.4.3","_npmUser":{"name":"pb82","email":"peter-braun@gmx.net"},"dist":{"shasum":"50d5903d5b6124853d18871f2d42db6b4b0f6ab9","tarball":"https://registry.npmjs.org/fh-fhc/-/fh-fhc-2.18.0-896.tgz"},"maintainers":[{"name":"feedhenry","email":"npm@feedhenry.com"},{"name":"grdryn","email":"gryan@redhat.com"},{"name":"pb82","email":"peter-braun@gmx.net"},{"name":"wtrocki","email":"wtrocki@redhat.com"}],"_npmOperationalInternal":{"host":"s3://npm-registry-packages","tmp":"tmp/fh-fhc-2.18.0-896.tgz_1501062424007_0.6798531822860241"}};

var data = {
  "name": "fh-ngui",
  "version": "5.9.18-a2579c5",
  "branch": "undefined",
  "commit": "undefined",
  "environment": "production",
  "platform": {
    "version": "3.18.2",
    "grid": {
      "id": "SAM",
      "name": "US-SAM",
      "region": "us-east-1"
    },
    "site": {
      "id": "sam1"
    },
    "env": {
      "id": "sam1-core",
      "name": "Core MAP (US-SAM)",
      "size": "g2.medium",
      "descr": "Shared Enterprise North America"
    }
  }
};

var nock = require('nock');
module.exports = nock('https://apps.feedhenry.com')
  .get('/sys/info/version')
  .times(2)
  .reply(200, data);

module.exports = {
  'test fhc version': function(cb) {
    command({}, function (err, data) {
      assert.equal(err, null);
      assert.ok(data);
      return cb();
    });
  },
  'test fhc version --json': function(cb) {
    command({json:true}, function (err, data) {
      assert.equal(err, null);
      assert.ok(data);
      assert.equal(data.plataformVersion, "3.18.2");
      return cb();
    });
  }
};
