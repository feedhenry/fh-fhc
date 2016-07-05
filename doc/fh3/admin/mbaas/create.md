fhc-create(1)
=============
## SYNOPSIS

 fhc admin mbaas create --id=<id> --url=<url> --servicekey=<servicekey> --username=<username> --password=<password>

## EXAMPLES

  fhc admin mbaas create --id=<MBaaS id> --url=<MBaaS URL> --servicekey=<MBaaS Service Key> --username=<MBaaS User Name> --password=<MBaaS Password>    Creates an environment


## OPTIONS

  --id          Some unique identifier for your MBaaS  [required]
  --url         The hostname where your MBaaS exists   [required]
  --servicekey  Service key to authenticate the MBaaS  [required]
  --username    MBaaS Username                         [required]
  --password    MBaaS Password                         [required]

## DESCRIPTION

Creates an MBaaS.

