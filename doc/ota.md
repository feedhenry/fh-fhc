fhc-ota -- Build OTA version of an app
============================================

## SYNOPSIS

    fhc ota app=<appId> destination=<destination> version=<version> config=<config> keypass=<private key password> certpass=<certificate password>
      where <destination> is one of: andriod, iphone
      where <version> is specific to the destination, see http://www.feedhenry.com/TODO
      where <config> is either 'distribution' or 'release'
      'keypass' and 'certpass' only needed for 'release' builds
    
## DESCRIPTION

This command can be used to return the OTA installer URL of a Feedhenry application. To function, you must have an 'In-House' distribution certificate installed in the Feedhenry Studio. This command returns both the OTA install URL and a corresponding convenience short URL.

e.g. 
fhc ota app=mfLkParVTDcr80-uEk8OhEfT destination=iphone config=distribution keypass=password certpass= version=4.0
