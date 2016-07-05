fhc-create(1)
=============
## SYNOPSIS

 fhc app create --project=<project> --title=<title> --type=cloud_nodejs [--template=<template>] [--repo=<repo>] [--branch=<refs/heads/my-branch-name>]

## EXAMPLES

  fhc app create --project=1a2b3c --title=My New App --type=cloud_nodejs

  * Creates a new hybrid app from template.


  fhc app create --project=1a2b3c --title=My New App --type=cloud_nodejs --repo=git:///some.com/repo.git --branch=refs/heads/my-branch    

  * Creates a new hybrid app from a git repo.

## OPTIONS

  --project, -p  Unique 24 character GUID of the project you want this app to be created in.      [required]
  --title, -t    A title for your app.                                                            [required]
  --type    The type of application.                                                          [required]
  --template    Template of your app - e.g. hello_world_mbaas_instance. See fhc templates apps.  [default: "hello_world_mbaas_instance"]
  --repo      Repository to clone your app from.                                             
  --branch    Git branch to clone from. Takes format '--branch refs/heads/my-branch-name' [default: master]
  --env   If specified and the app is deployable, the app will be deployed to this environment automatically. Set it to "none" will not deploy the app.
  --wait    Optional. If this is set to true, the command will wait until the app is deployed (if enabled).                                                 

## DESCRIPTION

  Creates an application.
