#CLOUD

## SYNOPSIS
 fhc app cloud --app=<app> --env=<env> --data=<data> --path=<path>

## EXAMPLES
  fhc version                                                                                                
  fhc app act --app=1a2b3c --fn=<serverside Function> --data=<data to send> --env=<environment>              Performs an act request on app with id 1a2b3c
  fhc app cloud --app=1a2b3c --path=<serverside path from root> --data=<Data to send> --env=<environment>    Performs a cloud request on app with id 1a2b3c


## OPTIONS
  --env, -e, -e  Environment within which the request should be performed         [required]
  --data         Request body to send thru                                        [required]
  --fn           Cloud function name to call                                      [required]
  --path         Path of the cloud request                                        [required]

## DESCRIPTION

Performs a cloud request on a cloud app