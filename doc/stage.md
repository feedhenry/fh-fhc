fhc-stage(1) -- Stage FeedHenry Applications
============================================

## SYNOPSIS

    fhc stage <appId> 
    fhc stage <appId> --live --clean
    
## DESCRIPTION

This command can be used to stage your FeedHenry applications, either to the 'development' or 'live' FeedHenry environment. The '--clean' flag can be used to do a full clean restage, which has the following effect:
 - cleans out all old application log files
 - will remove any cached node npm modules and do an 'npm install' from scratch.

## Examples 

    fhc stage mfLkParVTDcr80-uEk8OhEfT --live
