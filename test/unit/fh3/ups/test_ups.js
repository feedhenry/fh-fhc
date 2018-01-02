var assert = require('assert');
var genericCommand = require('genericCommand');

var upsCmd = {
  config: genericCommand(require('cmd/fh3/ups/config')),
  read: genericCommand(require('cmd/fh3/ups/read')),
  reset: genericCommand(require('cmd/fh3/ups/reset')),
  send: genericCommand(require('cmd/fh3/ups/send')),
  add: genericCommand(require('cmd/fh3/ups/variant/add'))
};

var nock = require('nock');
var mockReadApp = {
  "id": "a62b152c-ee4a-45cf-a178-46c7e95cc1fc",
  "name": "MultiTest",
  "description": null,
  "pushApplicationID": "974a2ebf-adc0-4e23-b186-5c17ca19fbfa",
  "masterSecret": "e65de1df-0697-45cc-b92e-acdb78006cb5",
  "developer": "support",
  "variants": [
    {
      "id": "1f40d5f9-80e0-4ecd-ab5b-6ee8e45adc6b",
      "name": "android",
      "description": null,
      "variantID": "c9cf9f3a-af6c-4a62-b807-71ad1c8ee3df",
      "secret": "f31d5d90-b81f-4ed1-a0c3-4e209b9646f0",
      "developer": "support",
      "googleKey": "sasdaasd",
      "projectNumber": "adadssad",
      "type": "android"
    }
  ]
};

var mockInitConfigApp = {
  "access_token": "eyJhbGciOiJSUzI1NiJ9.eyJqdGkiOiI4ZTZlYjIxMC03ZGMxLTRjYzItYjY4Zi1kMTIzMTc2MTdhOWUiLCJleHAiOjE1MTQ5NzExMzAsIm5iZiI6MCwiaWF0IjoxNTE0OTcxMDcwLCJpc3MiOiJodHRwOi8vbG9jYWxob3N0OjkwODEvYXV0aC9yZWFsbXMvYWVyb2dlYXIiLCJhdWQiOiJ1bmlmaWVkLXB1c2gtc2VydmVyLWpzIiwic3ViIjoiNzQ2YmViMGUtOTBlZi00MzA0LThiNTktZjczYjM4NGE2YTQwIiwiYXpwIjoidW5pZmllZC1wdXNoLXNlcnZlci1qcyIsInNlc3Npb25fc3RhdGUiOiIwNjgzMTQ2Ni1mNzc5LTRlMTMtOTI3Mi1lZTI1ZTg1MDgxOGQiLCJjbGllbnRfc2Vzc2lvbiI6IjMyOTkxZGJkLThmYmEtNDdmOC05OTI4LWRhMjZmZWQ1MmM5MiIsImFsbG93ZWQtb3JpZ2lucyI6W10sInJlYWxtX2FjY2VzcyI6eyJyb2xlcyI6WyJkZXZlbG9wZXIiXX0sInJlc291cmNlX2FjY2VzcyI6eyJhY2NvdW50Ijp7InJvbGVzIjpbInZpZXctcHJvZmlsZSIsIm1hbmFnZS1hY2NvdW50Il19fSwibmFtZSI6IiIsInByZWZlcnJlZF91c2VybmFtZSI6InN1cHBvcnQifQ.FbT1LoqKXIE8y4frfWumfgIN3cS1P5Dx77kNfNjXlCsP1fuPRHVwMewbpdMyrbkLva_legb26VRfHXu_-Lcd2uZzINkGdFeqJJBPZ2NK2HQ9TcaBD102kvIy9G-xqZuV_nDRQWHXbnsyLbcFIaxCMQmypWAMYvUuPcYs-wMwaLm1rvcbtSNM_XykcGtmd0XrOqReovLHJRAWg6QaOT72vtz3GJncSUsucYpAkWbS4mOgpggRd5YpakUVJF7_abUfhHXIqs4Gz4FCEIResTPU8oj46kKC3S__rcAN1uc1xqC2vZq-g_mo8qFHHw3lpZGuU2lIELTZKpy6xlj61EEJXA",
  "expires_in": 60,
  "refresh_expires_in": 600,
  "refresh_token": "eyJhbGciOiJSUzI1NiJ9.eyJqdGkiOiJmMDJhMWZiZC01OTNmLTQ1NzMtOTc2OC1mMGNmNTliZGM1YjEiLCJleHAiOjE1MTQ5NzE2NzAsIm5iZiI6MCwiaWF0IjoxNTE0OTcxMDcwLCJpc3MiOiJodHRwOi8vbG9jYWxob3N0OjkwODEvYXV0aC9yZWFsbXMvYWVyb2dlYXIiLCJzdWIiOiI3NDZiZWIwZS05MGVmLTQzMDQtOGI1OS1mNzNiMzg0YTZhNDAiLCJ0eXAiOiJSRUZSRVNIIiwiYXpwIjoidW5pZmllZC1wdXNoLXNlcnZlci1qcyIsInNlc3Npb25fc3RhdGUiOiIwNjgzMTQ2Ni1mNzc5LTRlMTMtOTI3Mi1lZTI1ZTg1MDgxOGQiLCJjbGllbnRfc2Vzc2lvbiI6IjMyOTkxZGJkLThmYmEtNDdmOC05OTI4LWRhMjZmZWQ1MmM5MiIsInJlYWxtX2FjY2VzcyI6eyJyb2xlcyI6WyJkZXZlbG9wZXIiXX0sInJlc291cmNlX2FjY2VzcyI6eyJhY2NvdW50Ijp7InJvbGVzIjpbInZpZXctcHJvZmlsZSIsIm1hbmFnZS1hY2NvdW50Il19fX0.Y3UUDWmXvbwEI9Fc0gEYWu5vCXpADYFv0YvjbiHLfi3LmiErOIgGAsJBds-edXdvhGliV4MUFblcsU7LCwZ9qpXqXoyZq8wpSwY5CfO8l15R3B3vBjBud5c9Ejlhafq2VlQCbiIxN9Y0PTiP_FmHOfRKeN-c2C0KfNG1hz3H8NQsEili_jlAQiKmoPOApMWYANRDNNY8pc2Rcrhi38GskJ3Che4ZJ9x4t957BV_ADr190KKV6AsGTdHJ4U_XUkspyp7SM_RG14JTDz8Y_IsPtQIzHPSGO_FayxSJF0q1uXAkhbrocekTWJqLCEfmd3CITUta3OYqhPuzuFHRm6AoSA",
  "token_type": "bearer",
  "id_token": "eyJhbGciOiJSUzI1NiJ9.eyJqdGkiOiJlMGNhYzFhOC1iMTY2LTRjNWMtOGZmOS0zNDkyMjEwMDY5NGUiLCJleHAiOjE1MTQ5NzExMzAsIm5iZiI6MCwiaWF0IjoxNTE0OTcxMDcwLCJpc3MiOiJodHRwOi8vbG9jYWxob3N0OjkwODEvYXV0aC9yZWFsbXMvYWVyb2dlYXIiLCJhdWQiOiJ1bmlmaWVkLXB1c2gtc2VydmVyLWpzIiwic3ViIjoiNzQ2YmViMGUtOTBlZi00MzA0LThiNTktZjczYjM4NGE2YTQwIiwiYXpwIjoidW5pZmllZC1wdXNoLXNlcnZlci1qcyIsInNlc3Npb25fc3RhdGUiOiIwNjgzMTQ2Ni1mNzc5LTRlMTMtOTI3Mi1lZTI1ZTg1MDgxOGQiLCJuYW1lIjoiIiwicHJlZmVycmVkX3VzZXJuYW1lIjoic3VwcG9ydCJ9.YheI3KlM-CLuosbspeGaxbwH8WBIODz5YfE-dkY93bwWZeWp_k8p9Ueyt3rwpLtAxZs7wlwJP2V895F1xfy9LKFfF33TG8Wc5TwLf43jSm8FE1nyIROWtbxmo-0Yb1J6gM8cqWktsI-I6x2URMEdDjVCB7Q93Y6zJiTH0EULLT8w9J1Di0FxpXcu0OBQGkN8Qbf7ipIosArMMhRVmI4qN1XY2li2qZCCvXi0AO40xxCaLZZhz8njYWNz4MRa5NIEy73Ny83Kh2o7dN8nmSSF6jDN081xIBKywqT9jQTA5hov4bk50aJF1j64AdktW0YnnW_t6-rZ3QwlLvKzBQaryw",
  "not-before-policy": 0,
  "session-state": "06831466-f779-4e13-9272-ee25e850818d",
  "pushApplicationID": "974a2ebf-adc0-4e23-b186-5c17ca19fbfa"
};

var mockList = [{
  "id": "1f40d5f9-80e0-4ecd-ab5b-6ee8e45adc6b",
  "name": "android",
  "description": null,
  "variantID": "c9cf9f3a-af6c-4a62-b807-71ad1c8ee3df",
  "secret": "f31d5d90-b81f-4ed1-a0c3-4e209b9646f0",
  "developer": "support",
  "googleKey": "sasdaasd",
  "projectNumber": "adadssad",
  "type": "android"
}];

module.exports = nock('https://apps.feedhenry.com')
  .get('/api/v2/ag-push/init/1a')
  .times(8)
  .reply(200, mockInitConfigApp )
  .get('/api/v2/ag-push/rest/applications/974a2ebf-adc0-4e23-b186-5c17ca19fbfa')
  .times(3)
  .reply(200, mockReadApp )
  .put('/api/v2/ag-push/rest/applications/974a2ebf-adc0-4e23-b186-5c17ca19fbfa/reset')
  .times(2)
  .reply(200, mockReadApp)
  .post('/api/v2/ag-push/rest/sender')
  .reply(200, {})
  .get('/api/v2/ag-push/rest/applications/974a2ebf-adc0-4e23-b186-5c17ca19fbfa')
  .reply(200, mockList)

module.exports = {
  "test fhc ups config": function(cb) {
    upsCmd.config({app:'1a'}, function(err, data) {
      assert.equal(err, null);
      var table = data._table;
      assert.equal(table['0'][0], 'access_token');
      assert.equal(table['1'][0], 'expires_in');
      assert.equal(table['1'][1], '60');
      return cb();
    });
  },
  "test fhc ups read": function(cb) {
    upsCmd.read({app:'1a'}, function(err, data) {
      assert.equal(err, null);
      var table = data._table;
      assert.equal(table['0'][0], 'a62b152c-ee4a-45cf-a178-46c7e95cc1fc');
      return cb();
    });
  },
  "test fhc ups read --json": function(cb) {
    upsCmd.read({app:'1a', json:true}, function(err, data) {
      assert.equal(err, null);
      var table = data._table;
      assert.equal(table, null);
      return cb();
    });
  },
  "test fhc ups reset": function(cb) {
    upsCmd.reset({app:'1a'}, function(err, data) {
      assert.equal(err, null);
      return cb();
    });
  },
  "test fhc ups reset --json": function(cb) {
    upsCmd.reset({app:'1a', json:true}, function(err, data) {
      assert.equal(err, null);
      var table = data._table;
      assert.equal(table, null);
      return cb();
    });
  },
  "test fhc ups send": function(cb) {
    upsCmd.send({app:'1a', message:'test'}, function(err, data) {
      assert.equal(err, null);
      return cb();
    });
  }
};