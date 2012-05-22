fhc-build(1) -- Build FeedHenry Applications
============================================

## SYNOPSIS

    fhc build app=<appId> destination=<destination> version=<version> config=<config>  stage=<true|false> keypass=<private-key-password> certpass=<certificate-password> download=<true|false>
      where <destination> is one of: android, iphone
      where <version> is specific to the destination (e.g. Android version 4.0)
      where <config> is either 'debug' (default), 'distribution', or 'release'
      where <stage> is either 'true' or 'false', default is false
      where <provisioning> is the path to the provisioning profile
      'keypass' and 'certpass' only needed for 'release' builds
      'provisioning' is only optional for iphone or ipad builds
    
## DESCRIPTION

This command can be used to build your FeedHenry applications. If 'stage' is set to 'true', a server side stage of the app is done (if its a 'release' or 'distriburion' build, a Live stage is done, otherwise a Development stage).

e.g. 
fhc build app=mfLkParVTDcr80-uEk8OhEfT destination=iphone config=distribution keypass=password certpass= version=4.0
