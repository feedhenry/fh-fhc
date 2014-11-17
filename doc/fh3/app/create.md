fhc-create(1)
=============
## SYNOPSIS

 fhc app create --project=<project> --title=<title> [--template=<template>] [--repo=<repo>] [--branch=<branch>]

## EXAMPLES

  fhc app create --project=1a2b3c --title=My New App --type=cloud_nodejs                                Creates a new hybrid app from template
  fhc app create --project=1a2b3c --title=My New App --repo=git:///some.com/repo.git --branch=master    Creates a new hybrid app from a git repo


## OPTIONS

  --project, -p  Unique 24 character GUID of the project you want this app to be created in      [required]
  --title, -t    A title for your app                                                            [required]
  --template     Template of your app - e.g. hello_world_mbaas_instance. See fhc templates apps  [default: "hello_world_mbaas_instance"]
  --repo         Repository to clone your app from                                             
  --branch       Git branch to clone from                                                      

## DESCRIPTION

Creates an application.

