fhc-apps(1) -- List FeedHenry Applications
==========================================

## SYNOPSIS

    fhc apps 
    
## DESCRIPTION

This command can be used to list your FeedHenry applications. As with any command in FHC, passing a '--json' flag will return the list of FeedHenry Apps in JSON format.

You can also specify a '--bare' flag to the 'apps' command, e.g. just show app guids:

$ fhc apps --bare

t2Xva0-4X2AFsxbBzsRLSet1
VCtqRZTJWnhz5b3SbcS1LvVm
DOK1rO5L2WAW7fjE_MAIehio
t-Bq8rCXHMwJSY9heXZZs8AL

show app titles only:

$ fhc apps --bare=title

App 1 
App 2
App 3
App 4

This makes it easy to iterate over apps from bash command line, e.g. to ping all dev and live endpoints of all apps:

$ for i in $(fhc apps --bare);do echo "pinging: $i (dev & live)"; fhc ping $i; fhc ping $i --live; done


