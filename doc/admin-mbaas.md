fhc admin-mbaas [list]
fhc admin-mbaas read --id=<mBaaS id>
fhc admin-mbaas create --id=<mBaaS id> --url=<mBaaS URL> --servicekey=<mBaaS Service Key>
fhc admin-mbaas update --id=<mBaaS id> [--url=<mBaaS URL>] [--servicekey=<mBaaS Service Key>]
fhc admin-mbaas delete --id=<mBaaS id>

Where:  
`id` is some unique identifier for this mBaaS
`url` is the hostname of the mBaaS
`servicekey` is the administrative service key used to communicate with the mBaaS. This can be provided by your operations engineer.
