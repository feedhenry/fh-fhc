fhc-endpoints(1)
================
## SYNOPSIS

 fhc app endpoints --app=<app> --env=<env>

## EXAMPLES

  fhc endpoints --app=<appGuid> --env=<environmentName>    


## OPTIONS

  --app, -a  Unieque 24 character GUID of your application                       [required]
  --env, -e  The lifecycle environment your application is running in, e.g. dev  [required]

## DESCRIPTION

Provides the endpoints for the specified app in the specified environment.

