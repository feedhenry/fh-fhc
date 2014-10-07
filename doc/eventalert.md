fhc-eventalert(1) -- Manage alerts of a FeedHenry App
===================================================================

## SYNOPSIS

    fhc eventalert listOptions
    fhc eventalert create <appid> alertName categories=eventCategories severities=eventSeverities events=eventNames emails=emailAddresses --env=<environment>
    fhc eventalert clone <alertId> --env=<environment>
    fhc eventalert delete <alertId>
    fhc eventalert list <appId>
    fhc eventalert read <alertId>
    fhc eventalert read <appid> alertName
    fhc eventalert update <alertId> alertName categories=eventCategories severities=eventSeverities events=eventNames emails=emailAddresses

## DESCRIPTION

This command can be used to manage alerts for an app. For the valid values for eventCategories, eventSeverities and eventNames, please run 'fhc eventalert listOptions' to see the full list.
