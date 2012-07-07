fhc-local(1) -- Creates Local Server For Local Development
==========================================

## SYNOPSIS

    fhc local proxy=<true|false> watch=<true|false> app=<appId> packages=<package[,package...]> domain=<domain> port=<port>

## DESCRIPTION

This command can be used to allow you to locally develop applications and still make calls to the FH cloud.


### proxy

Specifies whether act calls will be proxied through to the app specified or handled locally. Only node.js based
apps can be handled locally. If proxy is false no other parameters are required

### app

the alias or guid to tell the server what app to proxy the cloud calls to

### domain

The domain where your app is hosted. Defaults to your current target.

### port

The port you want to run the local server on. Defaults to port 8888

### packages

A list of comma seperated packages that you want to be applied

### watch

If you are running cloud code locally (i.e proxy=false), watch specifes whether or not you want the code to be reloaded automatically
when a file is modified. Defaults to true.



## Example

fhc local proxy=true domain=apps app=lfablwq3bflabd_guias_ packages=ios,iphone