fhc-delete(1)
=============
## SYNOPSIS

 fhc app delete --project=<project> --app=<app>

## EXAMPLES

  fhc app delete --project=1a --app=2b    Deletes app with id 2b under project with id 1a


## OPTIONS

  --project, -p  Unique 24 character GUID of the project your app lives in  [required]
  --app, -a      Unique 24 character GUID of the app you want to delete     [required]

## DESCRIPTION

Deletes an app under a project.

