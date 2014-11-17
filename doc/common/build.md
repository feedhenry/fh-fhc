fhc-build(1) -- Build FeedHenry Applications
============================================

## SYNOPSIS

    fhc build app=<appId> destination=<destination> version=<version> config=<config> keypass=<private-key-password> certpass=<certificate-password> download=<true|false> cordova_version=<cordova-version>
      where <destination> is one of: andriod, iphone, ipad, ios(for universal binary), blackberry, windowsphone7, windowsphone(for windows phone 8)
      where <version> is specific to the destination (e.g. Android version 4.0)
      where <config> is either 'debug' (default), 'distribution', or 'release'
      where <provisioning> is the path to the provisioning profile
      where <cordova_version> is for specifying which version of Cordova to use. Currently supported: either 2.2 or 3.3. Only valid for Android for now.
      'keypass' and 'certpass' only needed for 'release' builds
      'provisioning' is only optional for iphone or ipad builds

## DESCRIPTION

This command can be used to build your FeedHenry applications.

e.g.
fhc build app=mfLkParVTDcr80-uEk8OhEfT destination=iphone config=distribution keypass=password certpass= version=4.0 cordova_version=3.3
