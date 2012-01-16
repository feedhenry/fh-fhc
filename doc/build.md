fhc-build(1) -- Build FeedHenry Applications
============================================

## SYNOPSIS

    fhc build app=<appId> destination=<destination> version=<version> config=<config> keypass=<private key password> certpass=<certificate password> download=<true|false>
      where <destination> is one of: android, iphone
      where <version> is specific to the destination, see http://www.feedhenry.com/TODO
      where <config> is either 'debug' (default) or 'release'
      'keypass' and 'certpass' only needed for 'release' builds
    
## DESCRIPTION

This command can be used to build your FeedHenry applications.

e.g. 
fhc build app=mfLkParVTDcr80-uEk8OhEfT destination=iphone config=distribution keypass=password certpass= version=4.0
