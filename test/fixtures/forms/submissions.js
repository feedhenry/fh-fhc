var mockSubmissionGet = {
  "_id": "5449109299e98c45145f8267",
  "appClientId": "1234567891234567891234567",
  "appCloudName": "testing-spg3x0azbb5zqpbczkdmex1o-dev",
  "appEnvironment": "dev",
  "appId": "Spg3XAs6fKk20pMUyCpWEU0s",
  "deviceFormTimestamp": "2014-10-23T14:27:35.525Z",
  "deviceIPAddress": "10.0.2.2,127.0.0.1",
  "deviceId": "FF92C92E0FE0457084744E7C5F321AE0",
  "formId": "5448beee532330bc443630f0",
  "formSubmittedAgainst": {
    "updatedBy": "testing-admin@example.com",
    "name": "testFileForm",
    "createdBy": "testing-admin@example.com",
    "description": "fas",
    "_id": "5448beee532330bc443630f0",
    "subscribers": [],
    "pageRules": [],
    "fieldRules": [],
    "pages": [
      {
        "_id": "5448beee532330bc443630ef",
        "fields": [
          {
            "values": [
              {
                "mbaasUrl": "/mbaas/forms/:appId/submission/:submissionId/file/:fileGroupId",
                "downloadUrl": "/api/v2/forms/submission/file/544913166a3c64652b00000f",
                "fieldId": "5448bf330f6a34bd449f2713",
                "hashName": "filePlaceHolder141407514398613993904JvGNJJApE7dhaqlUuTlM0th",
                "fileName": "testImage.png",
                "fileType": "image/png",
                "fileSize": 556975,
                "groupId": "544913166a3c64652b00000f"
              }
            ],
            "fieldOptions": {
              "validation": {
                "validateImmediately": true
              },
              "definition": {
                "minRepeat": 1,
                "maxRepeat": 5
              }
            },
            "required": true,
            "type": "file",
            "name": "File",
            "fieldCode": "fileCode",
            "_id": "5448bf330f6a34bd449f2713",
            "adminOnly": true,
            "repeating": true,
            "data": [
              {
                "_id": "5448bf330f6a34bd449f2713",
                "options": [],
                "idx": 0
              }
            ],
            "hide": "formVal",
            "editMode": true
          },
          {
            "values": [
              {
                "fieldId": "5448bf330f6a34bd449f2714",
                "fileUpdateTime": 1414074513334,
                "imgHeader": "data:image/png;base64,",
                "fileType": "image/png",
                "fileSize": 12042,
                "contentType": "base64",
                "hashName": "filePlaceHolder285dfc51549716dc8f76c4a77c3e0c3a",
                "fileName": "filePlaceHolder285dfc51549716dc8f76c4a77c3e0c3a.png",
                "groupId": "544910929004f04514000009",
                "url": "/api/v2/forms/submission/file/544910929004f04514000009?rand=0.6070812873076648",
                "mbaasUrl": "/mbaas/forms/:appId/submission/:submissionId/file/:fileGroupId"
              }
            ],
            "fieldOptions": {
              "validation": {
                "validateImmediately": true
              },
              "definition": {
                "minRepeat": 1,
                "maxRepeat": 5
              }
            },
            "required": true,
            "type": "signature",
            "name": "Signature",
            "fieldCode": "signatureCode",
            "_id": "5448bf330f6a34bd449f2714",
            "adminOnly": false,
            "repeating": true,
            "data": [
              {
                "val": "/api/v2/forms/submission/file/544910929004f04514000009?rand=0.18255801196210086",
                "_id": "5448bf330f6a34bd449f2714",
                "missingText": "",
                "idx": 0,
                "disabled": "",
                "url": "/api/v2/forms/submission/file/544910929004f04514000009?rand=0.18255801196210086",
                "groupid": "544910929004f04514000009",
                "hash": "filePlaceHolder285dfc51549716dc8f76c4a77c3e0c3a",
                "fileName": "filePlaceHolder285dfc51549716dc8f76c4a77c3e0c3a.png"
              }
            ],
            "hide": "formVal",
            "editMode": true
          },
          {
            "values": [
              {
                "groupId": "544910929004f0451400000b",
                "fieldId": "5448bf330f6a34bd449f2715",
                "fileUpdateTime": 1414074513338,
                "imgHeader": "data:image/png;base64,",
                "fileType": "image/png",
                "fileSize": 101974,
                "contentType": "base64",
                "hashName": "filePlaceHolder67f098ce80e8c8c93cc30daeb76ac7ee",
                "fileName": "filePlaceHolder67f098ce80e8c8c93cc30daeb76ac7ee.png",
                "url": "/api/v2/forms/submission/file/544910929004f0451400000b?rand=0.6208193632774055",
                "mbaasUrl": "/mbaas/forms/:appId/submission/:submissionId/file/:fileGroupId"
              }
            ],
            "fieldOptions": {
              "validation": {
                "validateImmediately": true
              },
              "definition": {
                "photoSource": "both",
                "photoType": "jpeg",
                "saveToPhotoAlbum": "true",
                "minRepeat": 1,
                "maxRepeat": 5
              }
            },
            "required": true,
            "type": "photo",
            "name": "Photo",
            "fieldCode": "photoCode",
            "_id": "5448bf330f6a34bd449f2715",
            "adminOnly": false,
            "repeating": true,
            "data": [
              {
                "val": "/api/v2/forms/submission/file/544910929004f0451400000b?rand=0.04734802013263106",
                "_id": "5448bf330f6a34bd449f2715",
                "missingText": "",
                "idx": 0,
                "disabled": "",
                "url": "/api/v2/forms/submission/file/544910929004f0451400000b?rand=0.04734802013263106?rand=0.7224612110294402",
                "groupid": "544910929004f0451400000b",
                "hash": "filePlaceHolder67f098ce80e8c8c93cc30daeb76ac7ee",
                "fileName": "filePlaceHolder67f098ce80e8c8c93cc30daeb76ac7ee.png"
              }
            ],
            "hide": "formVal",
            "editMode": true
          }
        ],
        "name": "page 1"
      }
    ],
    "lastUpdated": "2014-10-23T14:27:35.525Z",
    "dateCreated": "2014-10-23T08:40:14.390Z"
  },
  "masterFormTimestamp": "2014-10-23T14:27:35.525Z",
  "timezoneOffset": -60,
  "userId": null,
  "formFields": [
    {
      "fieldId": {
        "fieldOptions": {
          "validation": {
            "validateImmediately": true
          },
          "definition": {
            "minRepeat": 1,
            "maxRepeat": 5
          }
        },
        "required": true,
        "type": "signature",
        "name": "Signature",
        "fieldCode": "signatureCode",
        "_id": "5448bf330f6a34bd449f2714",
        "adminOnly": false,
        "repeating": true
      },
      "fieldValues": [
        {
          "fieldId": "5448bf330f6a34bd449f2714",
          "fileUpdateTime": 1414074513334,
          "imgHeader": "data:image/png;base64,",
          "fileType": "image/png",
          "fileSize": 12042,
          "contentType": "base64",
          "hashName": "filePlaceHolder285dfc51549716dc8f76c4a77c3e0c3a",
          "fileName": "filePlaceHolder285dfc51549716dc8f76c4a77c3e0c3a.png",
          "groupId": "544910929004f04514000009",
          "url": "/api/v2/forms/submission/file/544910929004f04514000009?rand=0.6070812873076648",
          "mbaasUrl": "/mbaas/forms/:appId/submission/:submissionId/file/:fileGroupId"
        }
      ]
    },
    {
      "fieldId": {
        "fieldOptions": {
          "validation": {
            "validateImmediately": true
          },
          "definition": {
            "photoSource": "both",
            "photoType": "jpeg",
            "saveToPhotoAlbum": "true",
            "minRepeat": 1,
            "maxRepeat": 5
          }
        },
        "required": true,
        "type": "photo",
        "name": "Photo",
        "fieldCode": "photoCode",
        "_id": "5448bf330f6a34bd449f2715",
        "adminOnly": false,
        "repeating": true
      },
      "fieldValues": [
        {
          "groupId": "544910929004f0451400000b",
          "fieldId": "5448bf330f6a34bd449f2715",
          "fileUpdateTime": 1414074513338,
          "imgHeader": "data:image/png;base64,",
          "fileType": "image/png",
          "fileSize": 101974,
          "contentType": "base64",
          "hashName": "filePlaceHolder67f098ce80e8c8c93cc30daeb76ac7ee",
          "fileName": "filePlaceHolder67f098ce80e8c8c93cc30daeb76ac7ee.png",
          "url": "/api/v2/forms/submission/file/544910929004f0451400000b?rand=0.6208193632774055",
          "mbaasUrl": "/mbaas/forms/:appId/submission/:submissionId/file/:fileGroupId"
        }
      ]
    },
    {
      "fieldId": {
        "fieldOptions": {
          "validation": {
            "validateImmediately": true
          },
          "definition": {
            "minRepeat": 1,
            "maxRepeat": 5
          }
        },
        "required": true,
        "type": "file",
        "name": "File",
        "fieldCode": "fileCode",
        "_id": "5448bf330f6a34bd449f2713",
        "adminOnly": true,
        "repeating": true
      },
      "fieldValues": [
        {
          "mbaasUrl": "/mbaas/forms/:appId/submission/:submissionId/file/:fileGroupId",
          "downloadUrl": "/api/v2/forms/submission/file/544913166a3c64652b00000f",
          "fieldId": "5448bf330f6a34bd449f2713",
          "hashName": "filePlaceHolder141407514398613993904JvGNJJApE7dhaqlUuTlM0th",
          "fileName": "testImage.png",
          "fileType": "image/png",
          "fileSize": 556975,
          "groupId": "544913166a3c64652b00000f"
        }
      ]
    }
  ],
  "comments": [],
  "status": "ok",
  "submissionStartedTimestamp": "2014-10-23T14:28:34.103Z",
  "updatedTimestamp": "2014-10-23T14:39:19.261Z",
  "submissionCompletedTimestamp": "2014-10-23T14:39:19.260Z",
  "statusCode": 200
};

var mockSubmissionList = {
  status: "ok",
  statusCode: 200,
  submissions: [mockSubmissionGet]
}

var nock = require('nock');
var headers = { 'Content-Type': 'application/json' };

module.exports = nock('https://apps.feedhenry.com')
.filteringRequestBody(function() {
  return '*';
})
.post('/api/v2/forms/submission', '*')
.reply(200, function(){ return mockSubmissionList }, headers)
.get('/api/v2/forms/submission/5449109299e98c45145f8267', '*')
.reply(200, function(){ return mockSubmissionGet }, headers);
