fhc-stats(1) -- FeedHenry Stats
===============================
## SYNOPSIS

    fhc stats <app-id> <stats-type> <num-results> --env=<environment>

## DESCRIPTION

Get App stats from your FeedHenry Application.

### app id

Your application id.

### stats-type

Type of stats. Options here are 'api' (in-built system stats, e.g. timing app end points, etc) or 'app' (stats a developer has put in their code using feedhenry.stats() API).

### num-results

Number of results you want returned. Numeric value.

### --env=<environment>

Use --env=<environment> to see stats from your app staged in another environment.

## EXAMPLES
    fhc stats h2n0pg-qvar407mijmsvbapz app 10 --env=live
