fhc-forms(1) -- Manage App Forms
==========================================================

## SYNOPSIS

    fhc forms [list]
    fhc forms create <form-file.json>
    fhc forms update <form-file.json>
    fhc forms get <form-id>
    fhc forms delete <form-id>
    fhc forms apps list
    fhc forms apps get <app-id>
    fhc forms apps update <app-id> <form-id>*
    fhc forms apps create <app-title> <theme-id> <form-id>*
    fhc forms formapps <form-id>
    fhc forms groups [list]
    fhc forms groups get <group-id>
    fhc forms groups update <group-id> <group-name> <user-id>* <form-id>* <app-id>* <theme-id>*   # user-id and form-id should be a comma-seperated list of values
    fhc forms groups create <group-name> <user-id>* <form-id>* <app-id>* <theme-id>*              # user-id and form-id should be a comma-seperated list of values
    fhc forms groups delete <group-id>
    fhc forms notifications [list] <form-id>fhc forms notifications add <form-id> <email-address>
    fhc forms notifications delete <form-id> <email-address>


## DESCRIPTION

Update FeedHenry App Forms JSON definitions, themes, form apps, groups and notifications from the command line.