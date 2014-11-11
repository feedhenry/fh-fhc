fhc-update(1)
=============
## SYNOPSIS

 fhc admin environments alias update --id=<id> [--environment=<environment>] [--environmentAlias=<environmentAlias>] [--environmentLabelAlias=<environmentLabelAlias>]

## EXAMPLES

  fhc admin-environment-aliases update --id=<environment alias id> [--environment=<environment id>] [--environmentAlias=<environment id alias>] [--environmentLabelAlias=<environment label alias>]    Update an environment alias by id


## OPTIONS

  --id                     Some unique identifier for your environment alias - retrieve this from the list command  [required]
  --environment            The name for your environment this alias is targeting                                  
  --environmentAlias       An aliased name for your environment                                                   
  --environmentLabelAlias  Description of your environment alias                                                  

## DESCRIPTION

Update an environments.

