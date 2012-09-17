fhc-cloudfoundry(1) -- FeedHenry CloudFoundry
=============================================

## SYNOPSIS

    fhc cloudfoundry <app-id> <cf-target> <cf-user> <cf-pwd>

## DESCRIPTION

WARNING: The command is now deprecated. Please use fhc deploy-target command instead.

This command can be used to set the CloudFoudry live staging target for an app. 'cf target' should be your CloudFoundry target (same as you use in VMC), and 'cf user/ cf pwd' should be your CloudFoundry login credentials for that target.

## Examples

    fhc cloudfoundry 123456789012345678901234 http://api.cloudfoundry.com foo@bar.com password


