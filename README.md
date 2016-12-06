FHC - FeedHenry Command Line Interface [![NPM version](https://badge.fury.io/js/fh-fhc.png)](http://badge.fury.io/js/fh-fhc)
======================================

FeedHenry CLI, the command line interface to [FeedHenry](http://www.feedhenry.com).

## Installation

* Install [Node.js](http://nodejs.org/)
* Install [NPM (the Node Package Manager)](http://npmjs.org/)
* Install FHC: `sudo npm install -g fh-fhc`

`fhc` should now be available your command line.  
`fhc -v` will tell you what version of fhc you have installed.

Finally, install FHC bash completion: `fhc completion >> ~/.bashrc` (or ~/.zshrc)

## Usage

### From the Command Line
To see the list of commands available, just run `fhc`.   
See `fhc help` for general help, or `fhc help <someCommand>` for help on a specific command.

To get started with fhc, set the FeedHenry target and then login:

`$ fhc target https://apps.feedhenry.com`

`$ fhc login <your-email-address> <your-password>`

To list your projects, use:

`$ fhc projects`

To create an app from a git repository use:

`fhc app create --project=SomeProjectId --title=WelcomeApp --type=cloud_nodejs git://github.com/feedhenry-templates/welcome-app.git`

### As a Node.js Module
You can also use `fh-fhc` as a Node.js module in your scripts. This is useful for scripting automated tests, mobile app client builds and cloud deploys.

First, install &  add it to your project dependencies by doing `npm install --save fh-fhc` from your project root.  
Then, you can require it in your code like so:

    var fhc = require('./lib/fhc');
    fhc.load(function(err){
      if (err){
        // Something went wrong
      }
      // FHC started up OK - we can now perform commands, like listing projects:
      fhc.projects({_ : []}, function(err, projects){
        if (err){
          // Handle error
        }
        console.log(projects);
      });
    });

Some commands require params to be passed in - these are typically passed like so:

    fhc.app.create({ title : 'Some title', project : 'someProjectId'}, function(){
    });

Older fhc commands still pass arguments in an ordered array, as below. The environment is still specified outside the array.

    fhc.app.logs({_ : ['projectId', 'appId'], env : 'dev' }, function(){
    });


## Extending
Version 1.0 of `fh-fhc` updates the structure of commands:

    lib
      cmd # all commands go here
        common # stuff which applies to both versions of feedhenry
        fh2    # feedhenry 2-specific commands go here (e.g. `account`)
        fh3    # feedhenry 3 specific commands go here (e.g. `project`)
      internal # internal piping goes here

The `common`, `fh2` and `fh3` directory structure doesn't get exposed to the user, but everything underneath does - meaning we can have a command `lib/cmd/common/fooGroup/barCommand.js`, another `lib/cmd/common/fh3/fooGroup/anotherCommand.js`, and be able to run both `fhc fooGroup barCommand` and `fhc fooGroup anotherCommand`.  
Internal commands in the internal directory are hidden from help output, but are still call-able.

 Writing new commands is a little different than before. Old commands export a function - new style commands export an object.

Commands are DRY'd up substantially - see App List `lib/cmd/fh3/app/list.js` as an example of what a command definition looks like. Using the 'demand' syntax, yargs look after all all validation -  you don't need to worry about it.
Commands can be DRY'd up even more if they're very similar - e.g. app start. This extends from a base class - anything with an _ prefix doesn't go into the command tree.

There's no longer need to require() new commands in many different places - no need to require() new commands at all, just put them in the relevant tree structure within in `lib/cmd`.
Tests are turbo'd, nock for mocks, coverage is at least a little better than before.


## Setting a Proxy Server

    fhc fhcfg set proxy http://host:port
    # eg:
    fhc fhcfg set proxy http://127.0.0.1:8080

## Tests

  `grunt test`

## Internationalization

all of the strings expecting to be internationalized has to be passed through i18n._() function like:

```js
module.exports = {
  'desc': i18n._('Version info about the FeedHenry instance we\'re connected to'),
  ...
}
```

To get strings translated, we use the Zanata, the web-based translation platform. the source strings file has to be uploaded into the Zanata server. that can be done with:

    grunt potupload

Prior to do that, please make sure you have an account on the Zanata server. if not, please visit https://translate.zanata.org and follow up the steps at http://docs.zanata.org/en/release/user-guide/account/account-sign-up/ to create an account, and http://zanata-client.readthedocs.io/en/latest/configuration/ to store the API key into $HOME/.config/zanata.ini.

## Node version :
FHC requires node 4.4.x version
