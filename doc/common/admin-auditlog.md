fhc-admin-auditlog(1) -- View your App Store Audit Logs
==================================================

## SYNOPSIS


    fhc admin-auditlog listlogs [limit=<limit>] [guid=<store item guid>] [type=<android|iphone>] [user=<user guid>] [device=<device guid>]
       when filters (such as guid and type) are supplied then the log entry must match ALL of the filters.
       when no limit is supplied, it defaults to 20

## DESCRIPTION

This command allows you to View your FeedHenry Mobile App Store Audit Logs. See http://docs.feedhenry.com/v2/mas.html for more information.

