fhc-fhcfg(1) -- Manage the fhc Configuration File
=====================================================

## SYNOPSIS

    fhc fhcfg set <key> <value> [--global]
    fhc fhcfg get <key>
    fhc fhcfg delete <key>
    fhc fhcfg list
    fhc fhcfg edit

## DESCRIPTION

fhc gets its configuration values from 5 sources, in this priority:

* cli:
  The command line flags.  Putting `--foo bar` on the command line sets the
  `foo` configuration parameter to `"bar"`.  A `--` argument tells the cli
  parser to stop reading flags.  A `--flag` parameter that is at the *end* of
  the command will be given the value of `true`.
* env:
  Any environment variables that start with `fhc_fhcfg_` will be interpreted
  as a configuration parameter.  For example, putting `fhc_fhcfg_foo=bar` in
  your environment will set the `foo` configuration parameter to `bar`.  Any
  environment configurations that are not given a value will be given the value
  of `true`.  Config values are case-insensitive, so `FHCFG_FOO=bar` will
  work the same.
* $HOME/.fhcrc (or the `userconfig` param, if set above):
  This file is an ini-file formatted list of `key = value` parameters.
* $PREFIX/etc/fhcrc (or the `globalconfig` param, if set above):
  This file is an ini-file formatted list of `key = value` parameters
* default configs:
  This is a set of configuration parameters that are internal to fhc, and are
  defaults if nothing else is specified.

## Sub-commands

fhcfg supports the following sub-commands:

### set

    fhc fhcfg set key value

Sets the config key to the value.

If value is omitted, then it sets it to "true".

### get

    fhc fhcfg get key

Echo the config value to stdout.

### list

    fhc fhcfg list

Show all the config settings.

### delete

    fhc fhcfg delete key

Deletes the key from all configuration files.

### edit

    fhc fhcfg edit

Opens the config file in an editor.  Use the `--global` flag to edit the global config.

