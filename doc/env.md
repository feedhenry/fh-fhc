fhc-env(1) -- Manage Cloud Environment Variables For Apps
==========================================================

## SYNOPSIS

    fhc env create <app-guid> <var_name> [<var_value_for_dev>] [<var_value_for_live>]
    fhc env update <app-guid> <var_id> [<new_var_name>] [<var_value_for_dev>] [<var_value_for_live>]
    fhc env read <app-guid> <var_id> [dev/live]
    fhc env list <app-guid> [dev/live]
    fhc env delete <app-guid> <var_id> [dev/live]
    
## DESCRIPTION

You can set a dev value and a live value for each environment variable name. The correct value will be set in the corresponding cloud environment.