fhc-admin-users(1) -- Administer FeedHenry Users
================================================

## SYNOPSIS

    fhc admin-users list
    fhc admin-users create username=<username> [password=<password>] [email=<email>] [name=<name>] [roles=<roles>] [authpolicies=<authpolicies>] [invite=<invitation>] [teams=<teamIds>]
    fhc admin-users delete <username>
    fhc admin-users read <username>
    fhc admin-users update username=<username> [password=<password>] [email=<email>] [name=<name>] [roles=<roles>] [authpolicies=<authpolicies>] [inviation=<invitation>] [teams=<teamIds>] [enabled=<enabled>]
    fhc admin-users enable <username>
    fhc admin-users disable <username>
    fhc admin-users changeroles <username> <roles>
    fhc admin-users changeauthpolicies <username> <authpolicies>
    fhc admin-users listdevices <username>
    fhc admin-users listinstallapps <username>
    fhc admin-users import <path-to-csv-file> [invite] [<roles> <authpolicies>]

    
## DESCRIPTION

This command allows you to Administer Users on the FeedHenry Platform. For more information, see http://docs.feedhenry.com/v2/useradmin.html.

## Examples

    fhc admin-users create username=testuser email=testuser@test.com teams=5783b4d706bb371b0960eff9,5783b21b0fd0211e09f218e9