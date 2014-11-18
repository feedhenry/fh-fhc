fhc-resources(1)
================
## SYNOPSIS

 fhc app resources --app=<app> --env=<env>

## EXAMPLES

  fhc app resources --app=1a --env=dev    Shows the resources of the app with id 1a in the dev environment


## OPTIONS

  --app, -a  Unique 24 character GUID of the cloud app you want to see resource info for  [required]
  --env      The cloud environment your app is running in                                 [required]

## DESCRIPTION

Lists resources of a cloud app

