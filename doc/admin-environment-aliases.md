fhc admin-environment-aliases [list]
fhc admin-environment-aliases read --id=<environment alias id>
fhc admin-environment-aliases create --environment=<environment id> --environmentAlias=<environment id alias> --environmentLabelAlias=<environment label alias>
fhc admin-environment-aliases update --id=<environment alias id> [--environment=<environment id>] [--environmentAlias=<environment id alias>] [--environmentLabelAlias=<environment label alias>]
fhc admin-environment-aliases delete --id=<environment alias id>

Where:
`id` is the unique id of an environment
`environmentAlias` is the alias of the id of an environment. Should be unique within a domain and it should not be the same as any id of existing environments.
`environmentLabelAlias` is the alias of the label of an environment (which will be displayed in the studio). Should be unique within a domain.