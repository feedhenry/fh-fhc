fhc-admin-storeitemgroups(1) -- Administer Store Item Groups
===============================================

## SYNOPSIS

    fhc admin-storeitemgroups list
    fhc admin-storeitemgroups create <group-name> <group-description>
    fhc admin-storeitemgroups delete <group-guid>
    fhc admin-storeitemgroups read <group-guid>
    fhc admin-storeitemgroups readByName <group-name>
    fhc admin-storeitemgroups update <group-guid> <group-name> <group-description>
    fhc admin-storeitemgroups addusers <group-guid> <user-email>*
    fhc admin-storeitemgroups removeusers <group-guid> <user-email>*
    fhc admin-storeitemgroups addstoreitems <group-guid> <storeitem-id>*
    fhc admin-storeitemgroups removestoreitems <group-guid> <storeitem-id>*
    
## DESCRIPTION

This command allows you to Administer your FeedHenry Store Item Groups. See http://docs.feedhenry.com/v2/storeitemgroupadmin.html for more information.