fhc-notifications(1) -- List/Delete notifications of a FeedHenry App
===================================================================

## SYNOPSIS

    fhc notifications [list] <app-guid> [--live]
    fhc notifications auditlog <app-guid> [--live]
    fhc notifications dismiss <app-guid> <notification-guid> [<notification-guid>] [--live]
    
## DESCRIPTION

This command can be used to list or dismiss notification messages of a FeedHenry Application. By default it will list the notifications for the "dev" environment. If the "--live" flag is set the notifications for the live environment will be returned.