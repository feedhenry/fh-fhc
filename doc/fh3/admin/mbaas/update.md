fhc-update(1)
=============
## SYNOPSIS

  `fhc admin mbaas update --id=<id> [--url=<url>] [--servicekey=<servicekey>] [--username=<username>] [--password=<password>]`

## EXAMPLES

  `fhc admin mbaas create --id=<MBaaS id> --url=<FeedHenry MBaaS URL> --servicekey=<MBaaS Service Key> --username=<MBaaS User Name> --password=<MBaaS Password> --label=<MBaaS label>`

 **Updates FeedHenry MBaaS Target**

  `fhc admin mbaas update --id=<MBaaS id> --url=<OpenShift Master URL> --servicekey=<MBaaS Service Key> --routerDNSUrl=<OpenShift Router DNS> --fhMbaasHost=<MBaaS URL> --label=<MBaaS label>`

 **Updates OpenShift 3 MBaaS Target**


## OPTIONS

### FeedHenry MBaaS Target

    --id              Some unique identifier for your MBaaS                                                               [required]
    --url             The hostname where your MBaaS exists                    
    --servicekey      Service key to authenticate the MBaaS                   
    --username        MBaaS Username                                          
    --password        MBaaS Password
    --label           Label for MBaaS Target                                        

### OpenShift 3 MBaaS Target

    --id              Some unique identifier for your MBaaS                                                               [required]
    --url             URL where the OpenShift Master(s) API is available (e.g. https://master.openshift.example.com:8443)
    --servicekey      The FHMBAAS_KEY environment variable value
    --routerDNSUrl    The wildcard DNS entry for your OpenShift Router (e.g. \*.cloudapps.example.com)
    --fhMbaasHost     Exposed route where fh-mbaas is running in OpenShift 3 (e.g. https://my-mbaas.openshift.example.com)
    --label           Label for MBaaS Target

## DESCRIPTION

Updates an MBaaS Target.
