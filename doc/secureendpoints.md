fhc-secureendpoints(1) -- Manage an Apps Secure Endpoints
=========================================================

## SYNOPSIS

    fhc secureendpoints [get] <app-id> [--live]
    fhc secureendpoints set-default <app-id> <default> [--live]
    fhc secureendpoints set-override <app-id> <endpoint> <default> [--live]
    fhc secureendpoints remove-override <app-id> <endpoint> [--live]
    where 'default' can be either 'https' or 'appapikey'. Use 'fhc appendpoints' to list an Apps endpoints.
    
## DESCRIPTION

Manage the Secure Endpoints for an App. See http://docs.feedhenry.com/v2/secureendpoints_api.html for more information.

## Examples 

    fhc secureendpoints mfLkParVTDcr80-uEk8OhEfT --live
