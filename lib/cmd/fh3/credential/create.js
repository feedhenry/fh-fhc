/* globals i18n */
var fhreq = require('../../../utils/request.js');
var fs = require('fs');
var util = require('util');

module.exports = {
  'desc' : i18n._('Create a credential bundle'),
  'examples' :
  [{
    cmd : 'fhc credential create --name=<name> --type=<type> --platform=<platform> --env=<env> --privatekey=<privatekey> --certificate=<certificate>',
    desc : "Create a credential bundle for Android"
  },{
    cmd : 'fhc credential create --name=<name> --type=<type> --platform=<platform> --env=<env>  --privatekey=<privatekey> --certificate=<certificate> --provisioning=<provisioning>',
    desc : "Create a credential bundle for IOS"
  }],
  'demand' : ['name', 'platform', 'privatekey', 'certificate'],
  'alias' : {
    'name': 'n',
    'type': 'n',
    'platform': 'p',
    'privatekey': 'pk',
    'certificate': 'c',
    'provisioning': 'pv',
    0: 'name',
    1: 'type',
    2: 'platform',
    3: 'privatekey',
    4: 'certificate',
    5: 'provisioning'
  },
  'describe' : {
    'name' : i18n._("Name for the credential bundle which you want create."),
    'type': i18n._("The default value is release. Option valid just for IOS platform. Options :['release','debug', 'distribution']"),
    'platform': i18n._("Platform Options : [android, ios]"),
    'env': i18n._("Default value is all. Environment ID which you want create the credential bundle."),
    'privatekey': i18n._("Path for the private key file (E.g --privateKey=/Users/user/privatekey)"),
    'certificate': i18n._("Path for the certificate file (E.g --certificate:/Users/user/certificate)"),
    'provisioning': i18n._("Path for the provisioning file. (E.g --provisioning:/Users/user/provisioning)")
  },
  'url' : '/box/api/credentials',
  'method' : 'post',
  'customCmd' : function(params,cb) {
    params.platform = params.platform.toLowerCase();
    if (params.platform !== 'ios' && params.platform !== 'android') {
      return cb( i18n._('Invalid parameter for platform: ') + params.platform);
    }

    var dataObject = [{
      name: 'bundleName',
      value: params.name
    },{
      name: 'platform',
      value: params.platform
    },{
      name: 'bundleType',
      value: 'release'
    },{
      name: 'privatekey',
      value: fs.createReadStream(params.privatekey)
    },{
      name: 'certificate',
      value: fs.createReadStream(params.certificate)
    }];

    if (params.env) {
      dataObject.push({
        name: 'environments',
        value: params.env
      });
    }

    if (params.platform === 'ios') {
      if (params.type && params.type !== 'release' && params.type !== 'distribution' &&  params.type !== 'debug') {
        return cb(i18n._('Invalid parameter for --type : ') + params.type);
      } else if (params.type) {
        dataObject.push({
          name: 'bundleType',
          value: params.type
        });
      }

      if (!params.provisioning) {
        return cb(i18n._('Missed parameter --provisioning.'));
      }

      dataObject.push({
        name: 'provisioning',
        value: fs.createReadStream(params.provisioning)
      });
    }

    fhreq.doRequestWithDataObjectValues(this.url,dataObject, null, null, util.format(i18n._("Credential bundle '%s' created successfully"), params.name), cb);
  }
};