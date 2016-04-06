fhc-create(1)
=============
## SYNOPSIS

 fhc admin environments create --id=<id> --label=<label> --targets=<targets>

## EXAMPLES

  fhc admin environments create --id=<environment id> --label=<label> --targets=<mbaasTargetId1>,<mbaasTargetId2>    Creates an environment


## OPTIONS

  --id       Some unique identifier for your environment     [required]
  --label    A label describing your environment             [required]
  --targets  Comma separated list of MBaaS Target hostnames  [required]

## DESCRIPTION

Creates an environments.

