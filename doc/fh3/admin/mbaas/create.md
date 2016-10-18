fhc-create(1)
=============
## SYNOPSIS

  `fhc admin mbaas create --id=<id> --url=<url> --servicekey=<servicekey> --username=<username> --password=<password>`

## EXAMPLES

  `fhc admin mbaas create --id=<MBaaS id> --url=<FeedHenry MBaaS URL> --servicekey=<MBaaS Service Key> --username=<MBaaS User Name> --password=<MBaaS Password> --type=feedhenry`

  **Creates FeedHenry MBaaS Target**

  `fhc admin mbaas create --id=<MBaaS id> --url=<OpenShift Master URL> --servicekey=<MBaaS Service Key> --routerDNSUrl=<OpenShift Router DNS> --fhMbaasHost=<MBaaS URL> --type=openshift3`

  **Creates OpenShift 3 MBaaS Target**


## OPTIONS

### FeedHenry MBaaS Target

    --id              Some unique identifier for your MBaaS                                                                     [required]
    --url             The hostname where your MBaaS exists                                                                      [required]
    --servicekey      Service key to authenticate the MBaaS                                                                     [required]
    --username        MBaaS Username                                                                                            [required]
    --password        MBaaS Password                                                                                            [required]
    --type            Type of MBaaS Target (feedhenry)                                                                          [required]
    --label           Label for MBaaS Target

### OpenShift 3 MBaaS Target

    --id              Some unique identifier for your MBaaS                                                                     [required]
    --url             URL where the OpenShift Master(s) API is available (e.g. https://master.openshift.example.com:8443)       [required]
    --servicekey      The FHMBAAS_KEY environment variable value                                                                [required]
    --routerDNSUrl    The wildcard DNS entry for your OpenShift Router (e.g. \*.cloudapps.example.com)                          [required]
    --fhMbaasHost     Exposed route where fh-mbaas is running in OpenShift 3 (e.g. https://my-mbaas.openshift.example.com)      [required]
    --type            Type of MBaaS Target (openshift3)                                                                         [required]
    --label           Label for MBaaS Target

## DESCRIPTION

Creates an MBaaS Target.
