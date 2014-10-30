fhc admin-environments [list]
fhc admin-environments read --id=<environment id>
fhc admin-environments create --id=<environment id> --label=<label> --targets=<mbaasTargetId1>,<mbaasTargetId2> [--autoDeployOnCreate=<true|false>] [--autoDeployOnUpdate=<true|false>]
fhc admin-environments update --id=<environment id> [--label=<label>] [--targets=<target1>,<target2>] [--autoDeployOnCreate=<true|false>] [--autoDeployOnUpdate=<true|false>]
fhc admin-environments delete --id=<environment id>

Where:  
`targets` is a comma separated list of mBaaS hostnames which this environment should deploy to. In most cases, this will be a single mBaaS. To see a list of available mBaaS targets, use the `fhc admin-mbaas` command. 
`autoDeployOnCreate` automatically deploys cloud apps to this environment upon first creation. This should be typically set to true for the first environment in your lifecycle chain (often `dev`), so that your new app is immediately previewable. 
`autoDeployOnUpdate` automatically deploys cloud apps to this environment for all subsequent updates.
