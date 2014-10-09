fhc-environments(1) -- FeedHenry Environments
=============================================

## SYNOPSIS

    fhc environments
    fhc environments --env=<environment>
    fhc environments resources  --env=<environment>
    fhc environments cache [flush] --env=<environment>
    fhc environments cache [set] [type] [value] (where 'type' is either 'percent' or 'size')  --env=<environment>

## DESCRIPTION

Show the FeedHenry Environments, and the Resources used by an Environment.

## Examples

    e.g. fhc environments --env=dev
    e.g. fhc environments resources --env=dev
    e.g. fhc environments cache flush --env=dev
    e.g. fhc environments cache set percent 50 --env=dev
    e.g. fhc environments cache set size 524288000 --env=live
