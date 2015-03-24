fhc-admin-storeitems(1) -- Administer Store Items
===============================================

## SYNOPSIS

    fhc admin-storeitems list
    fhc admin-storeitems create <name> [description=<description>] [authToken=<authToken>] [restrictToGroups=<restrictToGroups>]
    fhc admin-storeitems delete <storeitem guid>
    fhc admin-storeitems read <storeitem guid>
    fhc admin-storeitems update <storeitem guid> <name> <description> <authToken> [<restrictToGroups>]
    fhc admin-storeitems uploadicon <storeitem guid> <path to icon>
    fhc admin-storeitems uploadbinary <storeitem guid> <type iphone|android|ipad> <path to app binary>
    fhc admin-storeitems addpolicy <storeitem guid> <policy_guid>
    fhc admin-storeitems removepolicy <storeitem guid> <policy_guid>
    fhc admin-storeitems listpolicies <storeitem guid>
    fhc admin-storeitems grouprestrict <storeitem guid> <true|false>
    fhc admin-storeitems addgroups <storeitem guid> <group_guid>*
    fhc admin-storeitems removegroups <storeitem guid> <group_guid>*
    fhc admin-storeitems binaryversions <storeitem guid>

## DESCRIPTION

This command allows you to Administer your FeedHenry App Store. See http://docs.feedhenry.com/v2/mas.html for more information.