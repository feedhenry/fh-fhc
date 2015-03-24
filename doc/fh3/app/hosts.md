fhc-hosts(1)
============
## SYNOPSIS

 fhc app hosts --app=<app> --env=<env>

## EXAMPLES

  fhc app hosts --app=2b --env=dev    Gets the host for the 2b app in the dev environment


## OPTIONS

  --app, -a  Unique 24 character GUID of the app you want to delete  [required]
  --env, -e  Environment to look up the host for                     [required]

## DESCRIPTION

Gets the host for a cloud app in an environment.

