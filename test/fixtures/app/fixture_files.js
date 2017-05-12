var mockFileRead = {
  "contents": "var c = \"Welcome to Waterford\";\n",
  "created": "Wed Jul 20 10:49:36 IST 2011",
  "fileName": "test.js",
  "filePath": "/client/default/js/",
  "guid": "ZYeFBUgw8qLSfzfts-vP53iu",
  "isBinary": false,
  "isDirectory": false,
  "modified": "Fri Jul 22 09:28:01 IST 2011",
  "status": "ok",
  "version": 70,
  "_etag": "\"HI51UacMWn1k8dE6O0qvS-\""
};

function mockFileList() {
  return {
    "children": [
      {
        "children": [
          {
            "children": [
              {
                "children": [
                  {
                    "guid": "ZYeFBIZG60dG-EhNV1RiXdki",
                    "name": "style.css",
                    "path": "/client/default/css/style.css",
                    "type": "file"
                  }
                ],
                "guid": "ZYeFBIZG60dG-EhNV1RiXdki",
                "name": "css",
                "path": "/client/default/css",
                "type": "folder"
              },
              {
                "children": [
                  {
                    "guid": "ZYeFBJJIrui-TRHFCmHNebSG",
                    "name": "init.js",
                    "path": "/client/default/js/init.js",
                    "type": "file"
                  },
                  {
                    "guid": "ZYeFBUgw8qLSfzfts-vP53iu",
                    "name": "test.js",
                    "path": "/client/default/js/test.js",
                    "type": "file"
                  }
                ],
                "guid": "ZYeFBJJIrui-TRHFCmHNebSG",
                "name": "js",
                "path": "/client/default/js",
                "type": "folder"
              },
              {
                "guid": "ZYeFBFAQ8e0eeljmVTFZAIUT",
                "name": "index.html",
                "path": "/client/default/index.html",
                "type": "file"
              }
            ],
            "guid": "ZYeFBFAQ8e0eeljmVTFZAIUT",
            "name": "default",
            "path": "/client/default",
            "type": "folder"
          }
        ],
        "guid": "ZYeFBFAQ8e0eeljmVTFZAIUT",
        "name": "client",
        "path": "/client",
        "type": "folder"
      },
      {
        "children": [
          {
            "guid": "ZYeFBREvJHNpu4WOtarJzEag",
            "name": "main.js",
            "path": "/cloud/main.js",
            "type": "file"
          }
        ],
        "guid": "ZYeFBREvJHNpu4WOtarJzEag",
        "name": "cloud",
        "path": "/cloud",
        "type": "folder"
      },
      {
        "children": [
          {
            "guid": "ZYeFBKtlNkJzJGc6hwC9hnCm",
            "name": "config.js",
            "path": "/shared/config.js",
            "type": "file"
          }
        ],
        "guid": "ZYeFBKtlNkJzJGc6hwC9hnCm",
        "name": "shared",
        "path": "/shared",
        "type": "folder"
      }
    ],
    "name": "/",
    "path": "",
    "status": "ok",
    "type": "folder"
  };
}

function mockFileUpdate() {
  return {
    "status": "ok",
    "_etag": "\"2kGtWojqx9Rc38alMU8w8k\""
  };
}

function mockFileCreate () {
  return {
    guid: 'rDfYZYkRMYfEGaREzgm9Mu-5',
    path: '/client/default/js/test14432.js',
    status: 'ok',
    type: 'file',
    _etag: '"o7yKfmI65bg-A9PLf21Jj-"'
  };
}

function mockFileDelete() {
  return {
    status: 'ok',
    _etag: '"2kGtWojqx9Rc38alMU8w8k"'
  };
}

var nock = require('nock');
var headers = { 'Content-Type': 'application/json' };

module.exports = nock('https://apps.feedhenry.com')
.filteringRequestBody(function() {
  return '*';
})
.post('/box/srv/1.1/ide/apps/file/list', '*')
.reply(200, mockFileList, headers)
.post('/box/srv/1.1/ide/apps/file/read', '*')
.reply(200, mockFileRead, headers)
.post('/box/srv/1.1/ide/apps/file/update', '*')
.reply(200, mockFileUpdate, headers)
.post('/box/srv/1.1/ide/apps/file/create', '*')
.reply(200, mockFileCreate, headers)
.post('/box/srv/1.1/ide/apps/file/delete', '*')
.reply(200, mockFileDelete, headers);
