fhc-update(1)
=============
## SYNOPSIS

 fhc admin environments update --id=<id> [--label=<label>] [--targets=<targets>]

## EXAMPLES

  fhc admin environments update --id=<environment id> --label=<label> --targets=<mbaasTargetId1>,<mbaasTargetId2>    Update an environment by id


## OPTIONS

  --id       Some unique identifier for your environment     [required]
  --label    A label describing your environment           
  --targets  Comma separated list of MBaaS Target hostnames

## DESCRIPTION

Update an environments.

