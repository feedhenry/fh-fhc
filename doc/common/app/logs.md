fhc-app-logs(1) -- FeedHenry Application Log Files
==============================================

## SYNOPSIS

    fhc app logs [get] <app-id> [log-name] --env=<environment>
    fhc app logs tail <app-id> [last-N-lines] [offset-from] [log-name] --env=<environment>
	fhc app logs list <app-id> --env=<environment>
    fhc app logs delete <app-id> <log-name> --env=<environment>

## DESCRIPTION

This command can be used to list/retrieve/delete/tail your Application log files.

Note: log tail defaults to the current std-out log file & display last 1000 lines of log file. To specify an offset, pass -1 for the last-N-lines param. e.g.

    fhc logs tail -1 12345

This will return all log entries from position 12345 onwards.

## EXAMPLES

    fhc logs mfLkParVTDcr80-uEk8OhEfT --env=dev
