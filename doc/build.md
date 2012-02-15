fhc-build(1) -- Build FeedHenry Applications
============================================

## SYNOPSIS

    fhc build <make-params>
    fhc build make <make-params>
    fhc build start <make-params>
    fhc build status <status-params>

      where <make-params> is app=<appId> destination=<destination> version=<version> config=<config> keypass=<private-key-password> certpass=<certificate-password> download=<true|false>
      where <status-params> is cacheKey=<cache-key> start=<start>
      where <destination> is one of: android, iphone
      where <version> is specific to the destination, see http://www.feedhenry.com/TODO
      where <config> is either 'debug' (default) or 'release'
      'keypass' and 'certpass' only needed for 'release' builds
      where <cache-key> is a cache key of remote build job to poll
      where <start> is number incremented in subsequent calls

## DESCRIPTION

This command can be used to build your FeedHenry applications.

### MAKE

    fhc build make <make-params>
    fhc build <make-params>

Performs whole build process and will exit when build is ready to download (or when download completes if <download>=true).

e.g.
fhc build app=mfLkParVTDcr80-uEk8OhEfT destination=iphone config=distribution keypass=password certpass= version=4.0

### START

    fhc build start <make-params>

Starts remote build process and exits immediately. Returns one or more cache keys which represent remote jobs started. Use fhc build status to poll for jobs status.

### STATUS

    fhc build status <status-params>

Polls for status of the remote job identified by <cache-key>. The <cache-key>s are returned by fhc build start command.

Pass 0 as <start> when you are calling this command for the first time for given build. Pass subsequent numbers for subsequent calls. (?)

