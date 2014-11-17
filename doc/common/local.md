fhc-local(1) -- Creates Local Server For Local Development
==========================================

## SYNOPSIS

    fhc local <appid> [packages=<package[,package...]>] [clientPort=<port>] [cloudPort=<port>] [redisHost=<redisServer>] [redisPort=<redisPort>] [redisPassword=<password>] [debug=true] [debugBrk=true] [decoupled=true] [logprefix=false] [loghighlight=true]

## DESCRIPTION

This command can be used to allow you to locally develop applications, the cloud portion of your app will be run locally. If you haven't run the `fhc initlocal` command first, it will be automatically done. `fhc initlocal` requires access to the Internet, to download some settings, scripts, and CSS files from our cloud platform.

This command must be run from the root of your app, i.e. the folder which contains your cloud, client and shared directories.

Only the `<appid>` parameter is required. Just running "fhc local <appid>" will run the cloud code and server the client files locally.

If you are using the $fh.cache API calls in your cloud code, you should run a locally accessible redis server.  The redis host, port, and password can be specified on the command line and default to; host: 127.0.0.1, port: 6379, password: ""

If you are using the $fh.db() API calls in your cloud code, you should run a mondoDB server locally.  The mongo server is expected to be at; host: 127.0.0.1, and port: 27017, (the default mongo configuration)

The client and server sides of the app will be running on seperate ports locally, by default they will be 8000 and 8001

## PARAMETERS

### clientPort

The port you want to run the local client file server on. This defaults to port 8000.

### cloudHost

Value to report to the client code, as the location of the cloud code, the default is "http://127.0.0.1". It should be changed to the hostname or the ip address of the server when test on mobile devices.

### cloudPort

The port you want to run the local cloud server on. This defaults to port 8001.

### packages

A list of comma seperated packages that you want to be applied

### redisHost

The host running the local redis server, default: 127.0.0.1

### redisPort

The port for the locally running redis server, default: 6379

### redisPassword

The password for the local redis server, default is no password.

## The following parameters are not normally required to be changed from their defaults.

### startCloud

This parameter specifies whether or not to run the cloud part of the app. The default is "true"

### localDB

Connect to a local database, default is "true"

### debug

When set to true, allows connecting a debugger to the node process running the cloud code (passes the "--debug" parameter to node)

### debugBrk

When set to true, allows connecting a debugger to the node process running the cloud code, and waits for the debugger to connect (passes the "--debug-brk" parameter to node)

### decoupled

When set to true, prevents wrapping the contents of index.html

### logprefix

 when set to true, stdout and stderr messages will be prefixed with their file types - 'CLOUD stdout:' and 'CLOUD stderr:' respectively.

### loghighlight

 when set to true, stdout and stderr messages will be output in green or red text respectively.

## EXAMPLE

fhc local packages=ios,iphone clientPort=8000 redisHost=127.0.0.1
