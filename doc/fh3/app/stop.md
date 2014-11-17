fhc-stop(1)
===========
## SYNOPSIS

 fhc app stop --app=<app> --env=<env>

## EXAMPLES

  fhc stop --app=<appGuid> --env=<environmentName>    


## OPTIONS

  --app, -a  Unieque 24 character GUID of your application                       [required]
  --env, -e  The lifecycle environment your application is running in, e.g. dev  [required]

## DESCRIPTION

stops a cloud application. This command will only work if the app has previously been deployed

