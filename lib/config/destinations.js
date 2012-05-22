var destinations = module.exports = function(){

  return {
    "iphone" : [
      {
        name: "Developer Cert",
        destination: "iphone",
        resourceType: "certificate",
        buildType: "development"
      },
      {
        name: "Distribution Cert",
        destination: "iphone",
        resourceType: "certificate",
        buildType: "distribution"
      },
      {
        name: "Development Private Key",
        destination: "iphone",
        resourceType: "privatekey",
        buildType: "development"
      },
      {
        name: "Distribution Private Key",
        destination: "iphone",
        resourceType: "privatekey",
        buildType: "distribution"
      }
    ],
    android: [
      {
        name: "Distribution Cert",
        destination: "android",
        resourceType: "certificate",
        buildType: "distribution"
      },
      {
        name: "Distribution Private Key",
        destination: "android",
        resourceType: "privatekey",
        buildType: "distribution"
      }
    ],
    blackberry: [
      {
        name: "Sigtool.csk",
        destination: "blackberry",
        resourceType: "csk",
        buildType: "distribution"
      },
      {
        name: "Sigtool.db",
        destination: "blackberry",
        resourceType: "db",
        buildType: "distribution"
      }
    ]
  };

};