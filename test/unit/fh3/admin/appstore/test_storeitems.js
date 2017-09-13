var assert = require('assert');
var genericCommand = require('genericCommand');

var commands = {
  create: genericCommand(require('cmd/fh3/admin/appstore/storeitems/create')),
  delete: genericCommand(require('cmd/fh3/admin/appstore/storeitems/delete')),
  read: genericCommand(require('cmd/fh3/admin/appstore/storeitems/read')),
  uploadicon: genericCommand(require('cmd/fh3/admin/appstore/storeitems/uploadicon')),
  uploadbinary: genericCommand(require('cmd/fh3/admin/appstore/storeitems/uploadbinary')),
  listpolicies: genericCommand(require('cmd/fh3/admin/appstore/storeitems/listpolicies')),
  update: genericCommand(require('cmd/fh3/admin/appstore/storeitems/update')),
  addgroups: genericCommand(require('cmd/fh3/admin/appstore/storeitems/addgroups')),
  delgroups: genericCommand(require('cmd/fh3/admin/appstore/storeitems/delgroups')),
  binaryversions: genericCommand(require('cmd/fh3/admin/appstore/storeitems/binaryversions')),
  grouprestrict: genericCommand(require('cmd/fh3/admin/appstore/storeitems/grouprestrict')),
  list: genericCommand(require('cmd/fh3/admin/appstore/storeitems/list'))
};

var nock = require('nock');

var dataList = {
  "count": 1,
  "list": [
    {
      "authToken": "",
      "authpolicies": [
        "xpzaqtip2ctewg3hudhiyeuv"
      ],
      "binaries": [
        {
          "config": {},
          "storeItemBinaryVersion": 20,
          "sysModified": "Wed Aug 09 16:39:39 UTC 2017",
          "type": "android",
          "url": "https://support.us.feedhenry.com/box/api/mas/storeitem/install?guid=3a7wyhulrutbqbzuenidqojv",
          "versions": [
            {
              "config": {},
              "destinationCode": "android",
              "storeItemBinaryGuid": "3a7wyhulrutbqbzuenidqojv",
              "storeItemBinaryModified": "Wed Aug 09 16:00:56 UTC 2017",
              "storeItemBinaryVersion": 19,
              "url": "https://support.us.feedhenry.com/box/api/mas/storeitem/install?guid=3a7wyhulrutbqbzuenidqojv&binversGuid=i7ln7jazwutnk2lynlenfnzr&download=true"
            },
            {
              "config": {},
              "destinationCode": "android",
              "storeItemBinaryGuid": "3a7wyhulrutbqbzuenidqojv",
              "storeItemBinaryModified": "Wed Aug 09 15:04:08 UTC 2017",
              "storeItemBinaryVersion": 18,
              "url": "https://support.us.feedhenry.com/box/api/mas/storeitem/install?guid=3a7wyhulrutbqbzuenidqojv&binversGuid=hcfbmcdj53aebfl5zvyoa2o6&download=true"
            },
            {
              "config": {},
              "destinationCode": "android",
              "storeItemBinaryGuid": "3a7wyhulrutbqbzuenidqojv",
              "storeItemBinaryModified": "Wed Aug 09 15:03:13 UTC 2017",
              "storeItemBinaryVersion": 17,
              "url": "https://support.us.feedhenry.com/box/api/mas/storeitem/install?guid=3a7wyhulrutbqbzuenidqojv&binversGuid=yg7hgyppyf66kluztweytpgn&download=true"
            },
            {
              "config": {},
              "destinationCode": "android",
              "storeItemBinaryGuid": "3a7wyhulrutbqbzuenidqojv",
              "storeItemBinaryModified": "Wed Aug 09 15:02:51 UTC 2017",
              "storeItemBinaryVersion": 16,
              "url": "https://support.us.feedhenry.com/box/api/mas/storeitem/install?guid=3a7wyhulrutbqbzuenidqojv&binversGuid=azx64ziyfdxrbhgtjjrlojlu&download=true"
            }
          ]
        },
        {
          "config": {},
          "storeItemBinaryVersion": 2,
          "sysModified": "Fri Mar 31 00:46:24 UTC 2017",
          "type": "ipad",
          "url": "https://support.us.feedhenry.com/box/api/mas/storeitem/install?guid=5ronmj35yeuracgzdslh22xu",
          "versions": [
            {
              "config": {},
              "destinationCode": "ipad",
              "storeItemBinaryGuid": "5ronmj35yeuracgzdslh22xu",
              "storeItemBinaryModified": "Fri Mar 31 00:44:42 UTC 2017",
              "storeItemBinaryVersion": 1,
              "url": "https://support.us.feedhenry.com/box/api/mas/storeitem/install?guid=5ronmj35yeuracgzdslh22xu&binversGuid=5h2myvsp72agfx4yckfzzwdt&download=true"
            }
          ]
        },
        {
          "config": {
            "bundle_id": ""
          },
          "storeItemBinaryVersion": 9,
          "sysModified": "Fri Mar 31 00:44:36 UTC 2017",
          "type": "iphone",
          "url": "https://support.us.feedhenry.com/box/api/mas/storeitem/install?guid=zn6pecfqhyktf2rzt52mpbyy",
          "versions": [
            {
              "config": {
                "bundle_id": ""
              },
              "destinationCode": "iphone",
              "storeItemBinaryGuid": "zn6pecfqhyktf2rzt52mpbyy",
              "storeItemBinaryModified": "Fri Mar 31 00:44:18 UTC 2017",
              "storeItemBinaryVersion": 8,
              "url": "https://support.us.feedhenry.com/box/api/mas/storeitem/install?guid=zn6pecfqhyktf2rzt52mpbyy&binversGuid=zf7prdqyavpqz7rvnyfla2c5&download=true"
            },
            {
              "config": {
                "bundle_id": ""
              },
              "destinationCode": "iphone",
              "storeItemBinaryGuid": "zn6pecfqhyktf2rzt52mpbyy",
              "storeItemBinaryModified": "Fri Mar 31 00:44:27 UTC 2017",
              "storeItemBinaryVersion": 9,
              "url": "https://support.us.feedhenry.com/box/api/mas/storeitem/install?guid=zn6pecfqhyktf2rzt52mpbyy&binversGuid=gejkapwmbys4ze7g5attkkjt&download=true"
            },
            {
              "config": {
                "bundle_id": ""
              },
              "destinationCode": "iphone",
              "storeItemBinaryGuid": "zn6pecfqhyktf2rzt52mpbyy",
              "storeItemBinaryModified": "Fri Mar 31 00:44:18 UTC 2017",
              "storeItemBinaryVersion": 8,
              "url": "https://support.us.feedhenry.com/box/api/mas/storeitem/install?guid=zn6pecfqhyktf2rzt52mpbyy&binversGuid=cdeqxcj3amtgqqznc2gqcvnn&download=true"
            },
            {
              "config": {
                "bundle_id": ""
              },
              "destinationCode": "iphone",
              "storeItemBinaryGuid": "zn6pecfqhyktf2rzt52mpbyy",
              "storeItemBinaryModified": "Fri Mar 31 00:43:09 UTC 2017",
              "storeItemBinaryVersion": 7,
              "url": "https://support.us.feedhenry.com/box/api/mas/storeitem/install?guid=zn6pecfqhyktf2rzt52mpbyy&binversGuid=q5ip7b2yelcgoewdmlfk3jxq&download=true"
            }
          ]
        }
      ],
      "description": "test",
      "groups": [
        "64oj7wsmt5toh46rl3ni2ltz"
      ],
      "guid": "5w477lfgy3jrnovri7gctsb7",
      "icon": "",
      "name": "Push2",
      "notes": "",
      "requirements": "",
      "restrictToGroups": false,
      "screenshots": [],
      "support": {},
      "version": "",
      "whatsNew": ""
    }
  ],
  "status": "ok"
};

var iconFile = 'test/fixtures/admin/icon.jpg';
var binaryFile = 'test/fixtures/admin/binary.ipa';


var data = {
  "authToken": "",
  "authpolicies": [
    "xpzaqtip2ctewg3hudhiyeuv"
  ],
  "binaries": [
    {
      "config": {},
      "storeItemBinaryVersion": 20,
      "sysModified": "Wed Aug 09 16:39:39 UTC 2017",
      "type": "android",
      "url": "https://support.us.feedhenry.com/box/api/mas/storeitem/install?guid=3a7wyhulrutbqbzuenidqojv",
      "versions": [
        {
          "config": {},
          "destinationCode": "android",
          "storeItemBinaryGuid": "3a7wyhulrutbqbzuenidqojv",
          "storeItemBinaryModified": "Wed Aug 09 16:00:56 UTC 2017",
          "storeItemBinaryVersion": 19,
          "url": "https://support.us.feedhenry.com/box/api/mas/storeitem/install?guid=3a7wyhulrutbqbzuenidqojv&binversGuid=i7ln7jazwutnk2lynlenfnzr&download=true"
        },
        {
          "config": {},
          "destinationCode": "android",
          "storeItemBinaryGuid": "3a7wyhulrutbqbzuenidqojv",
          "storeItemBinaryModified": "Wed Aug 09 15:04:08 UTC 2017",
          "storeItemBinaryVersion": 18,
          "url": "https://support.us.feedhenry.com/box/api/mas/storeitem/install?guid=3a7wyhulrutbqbzuenidqojv&binversGuid=hcfbmcdj53aebfl5zvyoa2o6&download=true"
        },
        {
          "config": {},
          "destinationCode": "android",
          "storeItemBinaryGuid": "3a7wyhulrutbqbzuenidqojv",
          "storeItemBinaryModified": "Wed Aug 09 15:03:13 UTC 2017",
          "storeItemBinaryVersion": 17,
          "url": "https://support.us.feedhenry.com/box/api/mas/storeitem/install?guid=3a7wyhulrutbqbzuenidqojv&binversGuid=yg7hgyppyf66kluztweytpgn&download=true"
        },
        {
          "config": {},
          "destinationCode": "android",
          "storeItemBinaryGuid": "3a7wyhulrutbqbzuenidqojv",
          "storeItemBinaryModified": "Wed Aug 09 15:02:51 UTC 2017",
          "storeItemBinaryVersion": 16,
          "url": "https://support.us.feedhenry.com/box/api/mas/storeitem/install?guid=3a7wyhulrutbqbzuenidqojv&binversGuid=azx64ziyfdxrbhgtjjrlojlu&download=true"
        }
      ]
    },
    {
      "config": {},
      "storeItemBinaryVersion": 2,
      "sysModified": "Fri Mar 31 00:46:24 UTC 2017",
      "type": "ipad",
      "url": "https://support.us.feedhenry.com/box/api/mas/storeitem/install?guid=5ronmj35yeuracgzdslh22xu",
      "versions": [
        {
          "config": {},
          "destinationCode": "ipad",
          "storeItemBinaryGuid": "5ronmj35yeuracgzdslh22xu",
          "storeItemBinaryModified": "Fri Mar 31 00:44:42 UTC 2017",
          "storeItemBinaryVersion": 1,
          "url": "https://support.us.feedhenry.com/box/api/mas/storeitem/install?guid=5ronmj35yeuracgzdslh22xu&binversGuid=5h2myvsp72agfx4yckfzzwdt&download=true"
        }
      ]
    },
    {
      "config": {
        "bundle_id": ""
      },
      "storeItemBinaryVersion": 9,
      "sysModified": "Fri Mar 31 00:44:36 UTC 2017",
      "type": "iphone",
      "url": "https://support.us.feedhenry.com/box/api/mas/storeitem/install?guid=zn6pecfqhyktf2rzt52mpbyy",
      "versions": [
        {
          "config": {
            "bundle_id": ""
          },
          "destinationCode": "iphone",
          "storeItemBinaryGuid": "zn6pecfqhyktf2rzt52mpbyy",
          "storeItemBinaryModified": "Fri Mar 31 00:44:18 UTC 2017",
          "storeItemBinaryVersion": 8,
          "url": "https://support.us.feedhenry.com/box/api/mas/storeitem/install?guid=zn6pecfqhyktf2rzt52mpbyy&binversGuid=zf7prdqyavpqz7rvnyfla2c5&download=true"
        },
        {
          "config": {
            "bundle_id": ""
          },
          "destinationCode": "iphone",
          "storeItemBinaryGuid": "zn6pecfqhyktf2rzt52mpbyy",
          "storeItemBinaryModified": "Fri Mar 31 00:44:27 UTC 2017",
          "storeItemBinaryVersion": 9,
          "url": "https://support.us.feedhenry.com/box/api/mas/storeitem/install?guid=zn6pecfqhyktf2rzt52mpbyy&binversGuid=gejkapwmbys4ze7g5attkkjt&download=true"
        },
        {
          "config": {
            "bundle_id": ""
          },
          "destinationCode": "iphone",
          "storeItemBinaryGuid": "zn6pecfqhyktf2rzt52mpbyy",
          "storeItemBinaryModified": "Fri Mar 31 00:44:18 UTC 2017",
          "storeItemBinaryVersion": 8,
          "url": "https://support.us.feedhenry.com/box/api/mas/storeitem/install?guid=zn6pecfqhyktf2rzt52mpbyy&binversGuid=cdeqxcj3amtgqqznc2gqcvnn&download=true"
        },
        {
          "config": {
            "bundle_id": ""
          },
          "destinationCode": "iphone",
          "storeItemBinaryGuid": "zn6pecfqhyktf2rzt52mpbyy",
          "storeItemBinaryModified": "Fri Mar 31 00:43:09 UTC 2017",
          "storeItemBinaryVersion": 7,
          "url": "https://support.us.feedhenry.com/box/api/mas/storeitem/install?guid=zn6pecfqhyktf2rzt52mpbyy&binversGuid=q5ip7b2yelcgoewdmlfk3jxq&download=true"
        }
      ]
    }
  ],
  "description": "test",
  "groups": [
    "64oj7wsmt5toh46rl3ni2ltz"
  ],
  "guid": "5w477lfgy3jrnovri7gctsb7",
  "icon": "",
  "name": "Push2",
  "notes": "",
  "requirements": "",
  "restrictToGroups": false,
  "screenshots": [],
  "status": "ok",
  "support": {},
  "version": "",
  "whatsNew": ""
};
module.exports = nock('https://apps.feedhenry.com')
  .post('/box/srv/1.1/admin/storeitem/create')
  .reply(200, {})
  .post('/box/srv/1.1/admin/storeitem/delete')
  .reply(200, {})
  .get('/box/srv/1.1/admin/storeitem/list')
  .times(2)
  .reply(200, dataList)
  .post('/box/srv/1.1/admin/storeitem/listpolicies')
  .reply(200, {})
  .post('/box/srv/1.1/admin/storeitem/read')
  .times(4)
  .reply(200, data)
  .post('/box/srv/1.1/admin/storeitem/addgroups')
  .reply(200, {})
  .post('/box/srv/1.1/admin/storeitem/removegroups')
  .reply(200, {})
  .post('/box/srv/1.1/admin/storeitem/grouprestrict')
  .times(2)
  .reply(200, data)
  .post('/box/srv/1.1/admin/storeitem/delete')
  .reply(200, {})
  .post('/box/srv/1.1/admin/storeitem/uploadbinary')
  .times(2)
  .reply(200, {})
  .post('/box/srv/1.1/admin/storeitem/update')
  .times(2)
  .reply(200, data);

module.exports = {
  'test fhc admin appstore storeitems create --name=<name> --json': function(cb) {
    commands.create({name:"name",json:true}, function(err, data) {
      assert.equal(err, null);
      assert.equal(data._table,null);
      return cb();
    });
  },
  'test fhc admin appstore storeitems delete --id --json': function(cb) {
    commands.delete({id:"guid",json:true}, function(err, data) {
      assert.equal(err, null);
      assert.equal(data._table,null);
      return cb();
    });
  },
  'test fhc admin appstore storeitems list': function(cb) {
    commands.list({}, function(err, data) {
      assert.equal(err, null);
      assert.equal(data.status, "ok");
      var table = data._table;
      assert.equal(table['0'][0], '5w477lfgy3jrnovri7gctsb7');
      assert.equal(table['0'][1], 'Push2');
      assert.equal(table['0'][2], 'test');
      assert.equal(table['0'][3], 'xpzaqtip2ctewg3hudhiyeuv');
      assert.equal(table['0'][4], 'No');
      return cb();
    });
  },
  'test fhc admin appstore storeitems list --json': function(cb) {
    commands.list({json:true}, function(err, data) {
      assert.equal(err, null);
      assert.equal(data._table,null);
      return cb();
    });
  },
  'test fhc admin appstore storeitems read --id': function(cb) {
    commands.read({id:'5w477lfgy3jrnovri7gctsb7'}, function(err, data) {
      assert.equal(err, null);
      assert.equal(data.status, "ok");
      var table = data._table;
      assert.equal(table['0'][0], '5w477lfgy3jrnovri7gctsb7');
      assert.equal(table['0'][1], 'Push2');
      assert.equal(table['0'][2], 'test');
      assert.equal(table['0'][3], 'xpzaqtip2ctewg3hudhiyeuv');
      assert.equal(table['0'][4], 'No');
      return cb();
    });
  },
  'test fhc admin appstore storeitems read --id --json': function(cb) {
    commands.read({id:'5w477lfgy3jrnovri7gctsb7',json:true}, function(err, data) {
      assert.equal(err, null);
      assert.equal(data._table,null);
      assert.equal(data.status, "ok");
      return cb();
    });
  },
  'test fhc admin appstore storeitems delete --id=<id> --json': function(cb) {
    commands.delete({id:'5w477lfgy3jrnovri7gctsb7',json:true}, function(err, data) {
      assert.equal(err, null);
      assert.equal(data._table,null);
      return cb();
    });
  },
  'test admin appstore storeitems update --id=<id> --name=<name> --description=<description> --authToken=<authToken> --restrictToGroups=<true|false>': function(cb) {
    commands.update({id:'5w477lfgy3jrnovri7gctsb7',name:'Push2', description:'test',json:true}, function(err, data) {
      assert.equal(err, null);
      assert.equal(data.status, "ok");
      assert.equal(data._table,null);
      return cb();
    });
  },
  'test admin appstore storeitems listpolicies --id=<id>': function(cb) {
    commands.listpolicies({id:'5w477lfgy3jrnovri7gctsb7'}, function(err, data) {
      assert.equal(err, null);
      return cb();
    });
  },
  'test fhc admin appstore storeitems uploadicon --id=<id> --icon=<icon>': function(cb) {
    commands.uploadicon({id:'5w477lfgy3jrnovri7gctsb7', icon:iconFile}, function(err) {
      assert.equal(err, null);
      return cb();
    });
  },
  'test fhc admin appstore storeitems uploadbinary --id=<id> --icon=<icon>': function(cb) {
    commands.uploadbinary({id:'5w477lfgy3jrnovri7gctsb7', binary:binaryFile, type:'android'}, function(err) {
      assert.equal(err, null);
      return cb();
    });
  },
  'test fhc admin appstore storeitems addgroups --id=<id> --group=<group>': function(cb) {
    commands.addgroups({id:'5w477lfgy3jrnovri7gctsb7',group :'5w477lfgy3jrnovri7gctsb7'}, function(err) {
      assert.equal(err, null);
      return cb();
    });
  },
  'test fhc admin appstore storeitems delgroups --id=<id> --group=<group>': function(cb) {
    commands.delgroups({id:'5w477lfgy3jrnovri7gctsb7',group :'5w477lfgy3jrnovri7gctsb7'}, function(err) {
      assert.equal(err, null);
      return cb();
    });
  },
  'test fhc admin appstore storeitems binaryversions --id': function(cb) {
    commands.binaryversions({id:'5w477lfgy3jrnovri7gctsb7'}, function(err) {
      assert.equal(err, null);
      return cb();
    });
  },
  'test fhc admin appstore storeitems grouprestrict --id --restrictToGroups ': function(cb) {
    commands.grouprestrict({id:'5w477lfgy3jrnovri7gctsb7', restrictToGroups:false}, function(err, data) {
      assert.equal(err, null);
      var table = data._table;
      assert.equal(table['0'][0], '5w477lfgy3jrnovri7gctsb7');
      assert.equal(table['0'][1], 'Push2');
      assert.equal(table['0'][2], 'test');
      assert.equal(table['0'][3], 'xpzaqtip2ctewg3hudhiyeuv');
      assert.equal(table['0'][4], 'No');
      return cb();
    });
  },
  'test fhc admin appstore storeitems grouprestrict --id --restrictToGroups --json ': function(cb) {
    commands.grouprestrict({id:'5w477lfgy3jrnovri7gctsb7', restrictToGroups :false, json:true}, function(err) {
      assert.equal(err, null);
      assert.equal(data._table,null);
      return cb();
    });
  }

};