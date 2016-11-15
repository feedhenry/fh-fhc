fhc-build(1) -- Build FeedHenry Applications
============================================

## SYNOPSIS


      fhc build app=<appId> destination=<destination> version=<version> config=<config> keypass=<private-key-password> certpass=<certificate-password> download=<true|false> cordova_version=<cordova-version>

      <destination>         One of: android, iphone, ipad, ios(for universal binary), blackberry, windowsphone7, windowsphone (windows phone 8).
      <version>             Specific to the destination (e.g. Android version 4.0).
      <config>              Either 'debug' (default), 'distribution', or 'release'.
      <provisioning>        The path to the provisioning profile.
      <cordova_version>     For specifying which version of Cordova to use. Currently supported: either 2.2 or 3.3. Only valid for Android for now.
      <tag name>            The name of a connection tag for the cloud app, must be in Semantic Version format, e.g. 0.0.1.")
      'keypass' and 'certpass' only needed for 'release' builds
      'provisioning' is only optional for iphone or ipad builds

## DESCRIPTION

This command can be used to build your FeedHenry applications.

e.g.
fhc build app=mfLkParVTDcr80-uEk8OhEfT destination=iphone config=distribution keypass=password certpass= version=4.0 cordova_version=3.3
