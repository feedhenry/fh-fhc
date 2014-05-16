fhc-services(1) -- List FeedHenry Services
==========================================

## SYNOPSIS

    fhc services [list]
    fhc services create <service-id> [<type>]
    fhc services update <service-id> <prop-name> <value>
    fhc services read <service-id>
    fhc services delete <service-id>
      where <service-id> is a service id
      where <type> is a valid service type [default]
    
## DESCRIPTION

This command can be used to list your FeedHenry Services. As with any command in FHC, passing a '--json' flag will return the list of FeedHenry Apps in JSON format.

You can also specify a '--bare' flag to the 'apps' command, e.g. just show app guids:

$ fhc services --bare

t2Xva0-4X2AFsxbBzsRLSet1
VCtqRZTJWnhz5b3SbcS1LvVm
DOK1rO5L2WAW7fjE_MAIehio
t-Bq8rCXHMwJSY9heXZZs8AL

show Project ids and titles only:

$ fhc apps --bare="guid title"

t2Xva0-4X2AFsxbBzsRLSet1 Project1
VCtqRZTJWnhz5b3SbcS1LvVm Project2
DOK1rO5L2WAW7fjE_MAIehio Project3
t-Bq8rCXHMwJSY9heXZZs8AL Project4



