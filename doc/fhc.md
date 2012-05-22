fhc(1) -- FeedHenry CLI.
========================

## SYNOPSIS

    fhc <command> [args]

## DESCRIPTION

fhc is the command line interface to FeedHenry.

Run `fhc help` to get a list of available commands.

## CONFIGURATION

fhc is extremely configurable.  It reads its configuration options from
5 places.

* Command line switches:  
  Set a config with `--key val`.  All keys take a value, even if they
  are booleans (the config parser doesn't know what the options are at
  the time of parsing.)  If no value is provided, then the option is set
  to boolean `true`.
* Environment Variables:  
  Set any config by prefixing the name in an environment variable with
  `fhc_config_`.  For example, `export fhc_config_key=val`.
* User Configs:  
  The file at $HOME/.fhcrc is an ini-formatted list of configs.  If
  present, it is parsed.  If the `userconfig` option is set in the cli
  or env, then that will be used instead.
* Global Configs:  
  The file found at ../etc/fhcrc (from the node executable, by default
  this resolves to /usr/local/etc/fhcrc) will be parsed if it is found.
  If the `globalconfig` option is set in the cli, env, or user config,
  then that file is parsed instead.
* Defaults:  
  fhc's default configuration options are defined in
  lib/utils/config-defs.js.  These must not be changed.

See `fhc help config` for much much more information.
