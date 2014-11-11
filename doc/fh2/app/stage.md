fhc-app-stage(1) -- Stage FeedHenry Applications
============================================

## SYNOPSIS

    fhc app stage <appId> --env=<environment>
    fhc app stage <appId> [approver] [comment] --clean --env=<environment>

## DESCRIPTION

This command can be used to stage your FeedHenry applications, either to the 'development' or 'live' FeedHenry environment. The '--clean' flag can be used to do a full clean restage, which has the following effect:
 - cleans out all old application log files
 - will remove any cached node npm modules and do an 'npm install' from scratch.

When deploy to 'live' environment, the approver's name or email should be set. If it's not set in the command line, the user will be prompted for it. A comment can be added for the stage but it's optional.

## Examples

    fhc stage mfLkParVTDcr80-uEk8OhEfT --env=dev
