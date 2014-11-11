fhc-create(1)
=============
## SYNOPSIS

 fhc admin mbaas create --id=<id> --url=<url> --servicekey=<servicekey> --username=<username> --password=<password>

## EXAMPLES

  fhc admin mbaas create --id=<mBaaS id> --url=<mBaaS URL> --servicekey=<mBaaS Service Key> --username=<mBaaS User Name> --password=<mBaaS Password>    Creates an environment


## OPTIONS

  --id          Some unique identifier for your mBaaS  [required]
  --url         The hostname where your mBaaS exists   [required]
  --servicekey  Service key to authenticate the mBaaS  [required]
  --username    mBaaS Username                         [required]
  --password    mBaaS Password                         [required]

## DESCRIPTION

Creates an mBaaS.

