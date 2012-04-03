fhc-native(1) -- FeedHenry Actions
===============================
## SYNOPSIS

    fhc native config=<apple|android> app=<app-id | alias> [dir=<dir to write to>]

## DESCRIPTION

This is a utility command create the config file required by the different native libraries

### config

the platform to create the config file for

### app

the alias or guid to use in creating the config

### dir

An optional dir to write the file to. This is for use on the command line. If you don't specify a dir
or writing to the dir faile, the config will be outputted to the terminal.


## EXAMPLES
    fhc native config=apple app=c0TPJtvFbztuS2p7NhZN3oZz dir=/Users/me/Documents



