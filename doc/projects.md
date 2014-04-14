fhc-projects(1) -- List FeedHenry Proejcts
==========================================

## SYNOPSIS

    fhc projects [list]
    fhc projects create <project-title> [<template-id>]
    fhc projects update <project-id> <prop-name> <value>
    fhc projects read <project-id>
    fhc projects delete <project-id>
    fhc projects clone <project-id>
        Note 'clone' does a 'git clone' of each each App in your Project into the current working directory.
    
## DESCRIPTION

This command can be used to list your FeedHenry Projects. As with any command in FHC, passing a '--json' flag will return the list of FeedHenry Apps in JSON format.

You can also specify a '--bare' flag to the 'apps' command, e.g. just show app guids:

$ fhc projects --bare

t2Xva0-4X2AFsxbBzsRLSet1
VCtqRZTJWnhz5b3SbcS1LvVm
DOK1rO5L2WAW7fjE_MAIehio
t-Bq8rCXHMwJSY9heXZZs8AL

show Project ids and titles only:

$ fhc apps --bare="guid title"

t2Xva0-4X2AFsxbBzsRLSet1 Project1
VCtqRZTJWnhz5b3SbcS1LvVm Project2
DOK1rO5L2WAW7fjE_MAIehio Project3
t-Bq8rCXHMwJSY9heXZZs8AL Project4



