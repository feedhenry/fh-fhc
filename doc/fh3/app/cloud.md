fhc-cloud(1)
============
## SYNOPSIS

 fhc app cloud --app=<app> --env=<env> --data=<data> --path=<path>

## EXAMPLES

  fhc app cloud --app=1a2b3c --path=<serverside path from root> --data=<Data to send> --env=<environment>    Performs a cloud request on app with id 1a2b3c


## OPTIONS

  --app, -a  Unique 24 character GUID of the app you want to do a request on  [required]
  --env, -e  Environment within which the request should be performed         [required]
  --data     Request body to send thru                                        [required]
  --path     Path of the cloud request                                        [required]

## DESCRIPTION

Performs a cloud request on a cloud app

