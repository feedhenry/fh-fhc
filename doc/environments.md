fhc-environments(1) -- FeedHenry Environments
=============================================

## SYNOPSIS

    fhc environments
    fhc environments [env]
    fhc environments [env] resources
    fhc environments [env] cache [flush]
    fhc environments [env] cache [set] [type] [value] (where 'type' is either 'percent' or 'size')

## DESCRIPTION

Show the FeedHenry Environments, and the Resources used by an Environment.

## Examples 

    e.g. fhc environments dev
    e.g. fhc environments dev resources
    e.g. fhc environments dev cache flush
    e.g. fhc environments dev cache set percent 50
    e.g. fhc environments dev cache set size 524288000
