## FHC

### Dependencies

Install node.js &amp; npm.

Follow instructions on <a href="http://nodejs.org/">nodejs.org</a> for your OS. This will add 2 command line applications: <code>node</code> and <code>npm</code>

###Install FHC
Execute the following in a terminal/command prompt:

```
npm install -g fh-fhc
```

If installing on Linux, you may need to run this command as a sudoer:

```
sudo npm install -g fh-fhc
```

`fhc` will now be available from your command line (if you use zsh, do a `hash -r` to pick it up)

To test FHC is installed correctly, and to show the version you have installed, use:

```
fhc -v
```

<span style="font-size: 23px;line-height: 35px">Command Completion (Linux and Mac only)</span>
The FHC bash completion script allows Tab completion of the various FHC commands, including completing app identifiers when performing actions on a single app. To install the FHC bash completion script, execute the following:

```
fhc completion >> ~/.bashrc
```

If you're using an alternative shell to bash, you should append the output of <code>fhc completion</code> to the relevant file e.g. ~/.zshrc for zsh</p>

### Usage

    fhc <command> [args]


Use `fhc help` for general help, or `fhc help [command]` for help on a specific command.

To get started, set the target and then login:
```
fhc target https://[your-studio-domain].feedhenry.com
fhc login [email address] [password]
```

To list your projects, use:

```
fhc projects
```

### Configuration

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
