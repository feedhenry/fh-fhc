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

Access your FeedHenry Projects

### list

    fhc projects [list]

This command is the default option and can be used to list your FeedHenry Projects. As with any command in FHC, passing a '--json' flag will return the list of FeedHenry Apps in JSON format.

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


### create

    fhc projects create <project-title> [<template-id>]

  Create is used to create a new FeedHenry Project based on a template.  The templates available can be listed using the ```fhc templates projects``` command

    fhc projects create 'FHC hello create' hello_world_project

  If no template-id is specified  the default of ```bare_project``` will be used, which will create a project containing no apps.

### update

    fhc projects update <project-id> <prop-name> <value>

  The only ```prop-name``` supported for updating is ```title```.  The title can be updated using a command like:

    fhc projects update DOK1rO5L2WAW7fjE_MAIehio title 'My New Project Title'

### read

    fhc projects read <project-id>

    Reads the information about the project specified, including the apps contained within it

### delete

    fhc projects delete <project-id>

    Deletes the specified project

### clone

    fhc projects clone <project-id>

  This clones each App in your Project locally.  It does a ```git clone``` of each each App in your Project into the current working directory,
  and needs the ```git``` command to be installed locally and on your current execution path. You must also have your SSH key uploaded to the FeedHenry platform.
