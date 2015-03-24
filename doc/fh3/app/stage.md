fhc-stage(1)
============
## SYNOPSIS

 fhc app stage --app=<app> --env=<env> [--runtime=<runtime>] [--clean=<clean>]

## EXAMPLES

  fhc stage --app=<appGuid> --env=<environmentName>    


## OPTIONS

  --app, -a      Unieque 24 character GUID of your application                                                                                         [required]
  --env, -e      The lifecycle environment your application is running in, e.g. dev                                                                    [required]
  --runtime, -r  The Node.js runtime of your application, e.g. node06 or node08 or node010                                                           
  --clean, -c    Do a full, clean stage. Cleans out all old application log files, removes cached node modules and does an 'npm install' from scratch

## DESCRIPTION

Stages a cloud application.

