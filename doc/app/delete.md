fhc-delete(1)
=============
## SYNOPSIS

 fhc app delete --project=<project> --app=<app>

## EXAMPLES

  fhc version                                                                                                
  fhc app act --app=1a2b3c --fn=<serverside Function> --data=<data to send> --env=<environment>              Performs an act request on app with id 1a2b3c
  fhc app cloud --app=1a2b3c --path=<serverside path from root> --data=<Data to send> --env=<environment>    Performs a cloud request on app with id 1a2b3c
  fhc app create --project=1a2b3c --title=My New App --type=cloud_nodejs                                     Creates a new hybrid app from template
  fhc app create --project=1a2b3c --title=My New App --repo=git:///some.com/repo.git --branch=master         Creates a new hybrid app from a git repo
  fhc app delete --project=1a --app=2b                                                                       Deletes app with id 2b under project with id 1a


## OPTIONS

  --env, -e, -e  Environment within which the request should be performed                        [required]
  --data         Request body to send thru                                                       [required]
  --fn           Cloud function name to call                                                     [required]
  --path         Path of the cloud request                                                       [required]
  --title, -t    A title for your app                                                            [required]
  --template     Template of your app - e.g. hello_world_mbaas_instance. See fhc templates apps  [default: "hello_world_mbaas_instance"]
  --repo         Repository to clone your app from                                             
  --branch       Git branch to clone from                                                      

## DESCRIPTION

Deletes an app under a project.

