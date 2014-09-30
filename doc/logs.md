fhc-logs(1) -- FeedHenry Application Log Files
==============================================

## SYNOPSIS

    fhc logs [get] <app-id> [log-name] [--env=<environment>]
    fhc logs tail <app-id> [last-N-lines] [offset-from] [log-name] [--env=<environment>]
	fhc logs list <app-id> [--env=<environment>]
    fhc logs delete <app-id> <log-name> [--env=<environment>]

## DESCRIPTION

This command can be used to list/retrieve/delete/tail your Application log files. Lists logs in dev by default - use the --env=<environment> switch to see logs from another environment.

Note: log tail defaults to the current std-out log file & display last 1000 lines of log file. To specify an offset, pass -1 for the last-N-lines param. e.g.

    fhc logs tail -1 12345

This will return all log entries from position 12345 onwards.

## EXAMPLES

    fhc logs mfLkParVTDcr80-uEk8OhEfT --env=<environment>
