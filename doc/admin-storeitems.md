fhc-admin-storeitems(1) -- Administer Store Items
===============================================

## SYNOPSIS

    fhc admin-storeitems list
    fhc admin-storeitems create <name> <description> <authToken>
    fhc admin-storeitems delete <storeitem guid>
    fhc admin-storeitems read <storeitem guid>
    fhc admin-storeitems update <storeitem guid> <name> <description> <authToken>
    fhc admin-storeitens uploadicon <storeitem guid> <path to icon>
    fhc admin-storeitems uploadbinary <storeitem guid> <type iphone|android|ipad> <path to app binary>
    fhc admin-storeitems addpolicy <storeitem guid> <policy_guid>
    fhc admin-storeitems removepolicy <storeitem guid> <policy_guid>
    fhc admin-storeitems listpolicies <storeitem guid>
    
## DESCRIPTION

This command allows you to Administer your FeedHenry App Store. See http://docs.feedhenry.com/v2/mas.html for more information.