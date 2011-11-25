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

Opens the config file in an editor.  Use the `--global` flag to edit the
global config.

TODO!

## Shorthands and Other CLI Niceties

The following shorthands are parsed on the command-line:

* `-v`: `--version`
* `-h`, `-?`, `--help`, `-H`: `--usage`
* `-s`, `--silent`: `--loglevel silent`
* `-d`: `--loglevel info`
* `-dd`, `--verbose`: `--loglevel verbose`
* `-ddd`: `--loglevel silly`
* `-g`: `--global`
* `-l`: `--long`
* `-p`, `--porcelain`: `--parseable`
* `-v`: `--version`
* `-f`: `--force`
* `-l`: `--long`
* `-desc`: `--description`
* `ll` and `la` commands: `ls --long`

If the specified configuration param resolves unambiguously to a known
configuration parameter, then it is expanded to that configuration
parameter.  For example:

    fhc ls --par
    # same as:
    fhc ls --parseable

If multiple single-character shorthands are strung together, and the
resulting combination is unambiguously not some other configuration
param, then it is expanded to its various component pieces.  For
example:

    fhc ls -gpld
    # same as:
    fhc ls --global --parseable --long --loglevel info


## Config Settings

### browser

* Default: OS X: `"open"`, others: `"google-chrome"`
* Type: String

TODO - The browser that is used to preview your web apps.

### cache

* Default: Windows: `~/fhc-cache`, Posix: `~/.fhc`
* Type: path

The location of fhc's cache directory.  See `fhc help cache`

### color

* Default: true
* Type: Boolean or `"always"`

If false, never shows colors.  If `"always"` then always shows colors.
If true, then only prints color codes for tty file descriptors.

### cookie

* Default: <blank>
* Type: String

The FeedHenry authentication cookie, this is set at login.

### editor

* Default: `EDITOR` environment variable if set, or `"vi"`
* Type: path

The command to run for `fhc edit` or `fhc config edit`.

### force

* Default: false
* Type: Boolean

Makes various commands more forceful.

* lifecycle script failure does not block progress.
* publishing clobbers previously published versions.
* skips cache when requesting from the registry.
* prevents checks against clobbering non-fhc files.

### logfd

* Default: stderr file descriptor
* Type: Number or Stream

The location to write log output.

### loglevel

* Default: "warn"
* Type: String
* Values: "silent", "win", "error", "warn", "info", "verbose", "silly"

What level of logs to report.  On failure, *all* logs are written to
`fhc-debug.log` in the current working directory.

### outfd

* Default: standard output file descriptor
* Type: Number or Stream

Where to write "normal" output.  This has no effect on log output.

### parseable

* Default: false
* Type: Boolean

Output parseable results from commands that write to
standard output. TODO - investigate

### proxy

* Default: "HTTP_PROXY" or "http_proxy" environment variable, or null
* Type: url

A proxy to use for outgoing http requests.

### feedhenry

* Default: https://apps.feedhenry.com/
* Type: url

The base URL of the FeedHenry server.

### tar

* Default: TAR environment variable, or "tar"
* Type: path

The tar executable

### tmp

* Default: TMPDIR environment variable, or "/tmp"
* Type: path

Where to store temporary files and folders.  All temp files are deleted
on success, but left behind on failure for forensic purposes.

### usage

* Default: false
* Type: Boolean

Set to show short usage output (like the -H output)
instead of complete help when doing `fhc help`.

### username

* Default: null
* Type: String

The FeedHenry username. Set with `fhc login`.

### userconfig

* Default: ~/.fhcrc on Posix, or ~/fhc-config on Windows
* Type: path

The location of user-level configuration settings.

### version

* Default: false
* Type: boolean

If true, output the fhc version and exit successfully.

Only relevant when specified explicitly on the command line.

### viewer

* Default: "man"
* Type: path

The program to use to view help content.
