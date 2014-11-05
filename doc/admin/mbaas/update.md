fhc-update(1)
=============
## SYNOPSIS

 fhc admin mbaas update --id=<id> [--url=<url>] [--servicekey=<servicekey>] [--username=<username>] [--password=<password>]

## EXAMPLES

  fhc version                                                                                                                                           
  fhc app act --app=1a2b3c --fn=<serverside Function> --data=<data to send> --env=<environment>                                                         Performs an act request on app with id 1a2b3c
  fhc app cloud --app=1a2b3c --path=<serverside path from root> --data=<Data to send> --env=<environment>                                               Performs a cloud request on app with id 1a2b3c
  fhc app create --project=1a2b3c --title=My New App --type=cloud_nodejs                                                                                Creates a new hybrid app from template
  fhc app create --project=1a2b3c --title=My New App --repo=git:///some.com/repo.git --branch=master                                                    Creates a new hybrid app from a git repo
  fhc app delete --project=1a --app=2b                                                                                                                  Deletes app with id 2b under project with id 1a
  fhc endpoints --app=<appGuid> --env=<environmentName>                                                                                                 
  fhc app list --project=1a2b3c                                                                                                                         Passing project using a flag
  fhc app list 1a2b3c                                                                                                                                   Passing project as an argument
  fhc app read --project=1a --app=2b                                                                                                                    Reads app with id 2b under project with id 1a
  fhc resources --app=1a --env=dev                                                                                                                      Shows the resources of the app with id 1a in the dev environment
  fhc stage --app=<appGuid> --env=<environmentName>                                                                                                     
  fhc start --app=<appGuid> --env=<environmentName>                                                                                                     
  fhc stop --app=<appGuid> --env=<environmentName>                                                                                                      
  fhc suspend --app=<appGuid> --env=<environmentName>                                                                                                   
  fhc admin environments create --id=<environment id> --label=<label> --targets=<mbaasTargetId1>,<mbaasTargetId2>                                       Creates an environment
  fhc admin environments delete --id=<environment id>                                                                                                   Delete an environment by id
  fhc admin environments list                                                                                                                           Lists available environments
  fhc admin environments read --id=<id>                                                                                                                 Read an environment by id
  fhc admin environments update --id=<environment id> --label=<label> --targets=<mbaasTargetId1>,<mbaasTargetId2>                                       Update an environment by id
  fhc admin mbaas create --id=<mBaaS id> --url=<mBaaS URL> --servicekey=<mBaaS Service Key> --username=<mBaaS User Name> --password=<mBaaS Password>    Creates an environment
  fhc admin mbaas delete --id=<mBaaS id>                                                                                                                
  fhc admin mbaas list                                                                                                                                  Lists available mBaaSes
  fhc admin mbaas read --id=<mBaaS id>                                                                                                                  
  fhc admin mbaas update --id=<mBaaS id> --url=<mBaaS URL> --servicekey=<mBaaS Service Key> --username=<mBaaS User Name> --password=<mBaaS Password>    Updates an environment with id <mbaasId>


## OPTIONS

  --data         Request body to send thru                                                                                                             [required]
  --fn           Cloud function name to call                                                                                                           [required]
  --path         Path of the cloud request                                                                                                             [required]
  --title, -t    A title for your app                                                                                                                  [required]
  --template     Template of your app - e.g. hello_world_mbaas_instance. See fhc templates apps                                                        [default: "hello_world_mbaas_instance"]
  --repo         Repository to clone your app from                                                                                                   
  --branch       Git branch to clone from                                                                                                            
  --runtime, -r  The Node.js runtime of your application, e.g. node06 or node08 or node010                                                           
  --clean, -c    Do a full, clean stage. Cleans out all old application log files, removes cached node modules and does an 'npm install' from scratch
  --id           Some unique mBaaS identifier                                                                                                          [required]
  --label        A label describing your environment                                                                                                   [required]
  --targets      Comma separated list of mBaaS Target hostnames                                                                                        [required]
  --url          The hostname where your mBaaS exists                                                                                                  [required]
  --servicekey   Service key to authenticate the mBaaS                                                                                                 [required]
  --username     mBaaS Username                                                                                                                        [required]
  --password     mBaaS Password                                                                                                                        [required]

## DESCRIPTION

Update an mBaaS.

