var nock = require('nock');

var buildResult = [[
  {
    "action": {
      "ota_url": "https://support.us.feedhenry.com/digman/android-v3/dist/c17b8311-52d4-4f39-84a9-848847e2129f/android~4.0~65~CordovaApp.apk?digger=diggers.sam1-farm2-linux1",
      "url": "https://support.us.feedhenry.com/digman/android-v3/dist/c17b8311-52d4-4f39-84a9-848847e2129f/android~4.0~65~CordovaApp.apk?digger=diggers.sam1-farm2-linux1"
    },
    "cacheKey": "c17b8311-52d4-4f39-84a9-848847e2129f",
    "error": "",
    "log": [
      "Backing-up App artefacts and setting up OTA links if available...",
      "Build Succeeded",
      "Build complete"
    ],
    "status": "complete"
  }
]];

module.exports = nock('https://apps.feedhenry.com')
.filteringRequestBody(function() {
  return '*';
})
.post('/box/srv/1.1/wid/apps/android/1a2b3c4d5e6f7g8e9f0a1b2d/deliver', '*')
.reply(200, buildResult);
