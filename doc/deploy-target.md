fhc-deploy-target(1) -- FeedHenry Deploy Targets
=============================================

## SYNOPSIS

    fhc deploy-target create name=<the name of the deploy target> platform=<cloudfoundry/stackato/appfog/ironfoundry> env=<dev/live/all> conf_url=<deploy url> conf_username=<user for the deploy> conf_password=<user password for the deploy> [conf_infrastructure=<infrastructure providers>]
    fhc deploy-target update id=<id of the deploy target> name=<the name of the deploy target> platform=<cloudfoundry/stackato> env=<dev/live/all> conf_url=<deploy url> conf_username=<user for the deploy> conf_password=<user password for the deploy> 
    fhc deploy-target read <id of the deployment target>
    fhc deploy-target list
    fhc deploy-target delete <id of the deployment target>
    fhc deploy-target listforapp <appid> <dev/live> [<platform>]
    fhc deploy-target getapptarget <appid> <dev/live>
    fhc deploy-target setapptarget <appid> <id of the deploy target> <dev/live>

## DESCRIPTION

This command can be used to manage the deployment targets as described [here](http://docs.feedhenry.com/v2/deployment_targets.html). You can also use this command to get/set a deployment target for an app.

## Examples

    fhc deploy-target create name=FirstDeployTarget platform=cloudfoundry env=all conf_url=http://api.cloudfoundry.com conf_username=user@example.com conf_password=password
    fhc deploy-target listforapp 123456789012345678901234 dev cloudfoundry
    fhc deploy-target setapptarget 123456789012345678901234 abcdefghijklmnopqrstuvwx dev
