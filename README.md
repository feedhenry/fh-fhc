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

See `fhc help` for general help, or `fhc help <command>` for help on a specific command.

To get started, set the FeedHenry target and then login:

`$ fhc target https://apps.feedhenry.com`

`$ fhc login <your-email-address> <your-password>`

To list your projects, use:

`$ fhc projects`

To create an app from a git repository use:

`fhc apps create StoreFinder git://github.com/feedhenry/Store-Finder.git`

### As a Node.js Module

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
    
## Extending
Version 1.0 of `fh-fhc` updates the structure of commands:
	
	lib
	  cmd # all commands go here
	  	common   # stuff which applies to both versions of feedhenry
	  	fh2		 # feedhenry 2-specific commands go here (e.g. `account`)
	  	fh3 	 # feedhenry 3 specific commands go here (e.g. `project`)
		internal # internal piping goes here
	    
Old commands export a function - new style commands export an object. 

## Setting a Proxy Server
    
    fhc fhcfg set proxy http://host:port
    # eg:
    fhc fhcfg set proxy http://127.0.0.1:8080
    
## Tests

	grunt test
