fhc-read(1)
===========
## SYNOPSIS

 fhc app read --project=<project> --app=<app>

## EXAMPLES

  fhc app read --project=1a --app=2b    Reads app with id 2b under project with id 1a


## OPTIONS

  --project, -p  Unique 24 character GUID of the project your app lives in  [required]
  --app, -a      Unique 24 character GUID of the app you want to delete     [required]

## DESCRIPTION

Reads an app under a project.

