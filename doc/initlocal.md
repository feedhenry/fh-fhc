fhc-initlocal(1) -- Initialises Local Server files For Local Development
==========================================

## SYNOPSIS

    fhc initlocal <appid>

## DESCRIPTION

This command connects to your current fhc target and downloads the container file for the specified app.  It also downloads the script and CSS files that are referenced by the app container.  The downloaded files are stored in the .fhclocal  

None of the parameters are required. Just running "fhc local" will try to run the cloud code locally.

If your cloud code uses the $fh.cache API, it will attempt to connect to a redis server accessible from your local machine.  The defaults for the redis parameters are; host: 127.0.0.1, port: 6379, password: ""

### port

The port you want to run the local client file server on. This defaults to port 8000.

### cloudPort

The port you want to run the local cloud server on. This defaults to port 8001.

### packages

A list of comma seperated packages that you want to be applied

## Example

fhc local packages=ios,iphone