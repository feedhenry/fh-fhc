fhc-env(1) -- Manage Cloud Environment Variables For Apps
==========================================================

## SYNOPSIS

    fhc env create <app-guid> <var_name> [<var_value>] --env=<environment>
    fhc env update <app-guid> <var_id> [<new_var_name>] [<var_value>] --env=<environment>
    fhc env read <app-guid> <var_id> --env=<environment>
    fhc env list <app-guid> --env=<environment>
    fhc env listDeployed <app-guid> [includeSystemEnvironmentVariables] --env=<environment>
    fhc env unset <app-guid> <var_id> --env=<environment>"
    fhc env delete <app-guid> <var_id>
    fhc env push <app-guid> --env=<environment>

## DESCRIPTION

Set a value per-environment for each environment variable name by using the --env=<environment> flag. Any changes of the environment variables will not be applied to the cloud applications until they are pushed.
