fhc-app-act(1) -- FeedHenry Actions
===============================
## SYNOPSIS

    fhc app act <app-id> <server-function> <params> --env=<environment>
    
## DESCRIPTION

This is a utility command to easily invoke your application server side functions in FeedHenry. 

### app id

Your application id.

### server function

The name of the server side function you wish to call, this will be a method in your server side 'main.js' file.

### params

The parameters that the function expects. FeedHenry expects one JSON object to be passed here which contains all the function parameters.

## EXAMPLES
    fhc act h2n0pg-qvar407mijmsvbapz helloWorld "{\"name\":\"bono\"}"
