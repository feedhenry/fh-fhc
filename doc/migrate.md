fhc-migrate(1) -- Migrate v2 Apps to v3 Projects
============================================

## SYNOPSIS

    fhc migrate <appId>
    fhc migrate <appId> --silent

## DESCRIPTION

This command can be used to migrate your v2 App to a v3 Project.
A pre-migration check is done prior to actual migration.
A prompt will be shown to confirm the migration after the pre-migration check.
This prompt can be silenced using the `--silent` argument.
Migration info is printed to stdout.
If the pre-migration check fails, the commands exits.
If the migration fails, the command exits after the platform attempts a rollback of the migration.

## Examples 

    fhc migrate mfLkParVTDcr80-uEk8OhEfT
    fhc migrate mfLkParVTDcr80-uEk8OhEfT --silent
