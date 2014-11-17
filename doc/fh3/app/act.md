fhc-act(1)
==========
## SYNOPSIS

 fhc app act --app=<app> --env=<env> --data=<data> --fn=<fn>

## EXAMPLES

  fhc app act --app=1a2b3c --fn=<serverside Function> --data=<data to send> --env=<environment>    Performs an act request on app with id 1a2b3c


## OPTIONS

  --app, -a  Unique 24 character GUID of the app you want to do a request on  [required]
  --env, -e  Environment within which the request should be performed         [required]
  --data     Request body to send thru                                        [required]
  --fn       Cloud function name to call                                      [required]

## DESCRIPTION

Performs an act request on a cloud app.

