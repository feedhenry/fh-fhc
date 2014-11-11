fhc-apps(1) -- List FeedHenry Applications
==========================================

## SYNOPSIS

    fhc apps [list] <project-id>
    fhc create <project-id> <app-title> [<template-id>]
    fhc create <project-id> <app-title> <template-type> <git-repo> [<git-branch>]
    fhc read <project-id> <app-id>
    fhc update <project-id> <app-id> <property-name> <property-value>
    fhc delete <project-id> <app-id>

## DESCRIPTION

This command can be used to list your FeedHenry applications. As with any command in FHC, passing a '--json' flag will return the list of FeedHenry Apps in JSON format.

You can also specify a '--bare' flag to the 'apps' command, e.g. just show app guids:

$ fhc apps 123456 --bare

t2Xva0-4X2AFsxbBzsRLSet1
VCtqRZTJWnhz5b3SbcS1LvVm
DOK1rO5L2WAW7fjE_MAIehio
t-Bq8rCXHMwJSY9heXZZs8AL

show app titles only:

$ fhc apps 123456 --bare=title

App 1
App 2
App 3
App 4

This makes it easy to iterate over apps from bash command line, e.g. to ping all dev and live endpoints of all apps:

$ for i in $(fhc apps --bare);do echo "pinging: $i (dev & live)"; fhc ping $i --env=dev; fhc ping $i --env=live; done
