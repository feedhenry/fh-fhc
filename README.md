FHC - FeedHenry Command Line Interface
======================================

FeedHenry CLI, the command line interface to [FeedHenry](http://www.feedhenry.com).

## Installation

* Install [Node.js](http://nodejs.org/)
* Install [NPM (the Node Package Manager)](http://npmjs.org/)
* Install FHC: `sudo npm install -g fh-fhc`

`fhc` should now be available your command line (do a `hash -r` if you use zsh to pick it up). `fhc -v` will tell you what version of fhc you have installed.

Finally, install FHC bash completion: `fhc completion >> ~/.bashrc` (or ~/.zshrc)

## Usage

See `fhc help` for general help, or `fhc help <command>` for help on a specific command.

To get started, set the FeedHenry target and then login:

`$ fhc target https://apps.feedhenry.com`

`$ fhc login <your email address> <your password>`

To list your apps, use:

`$ fhc apps`

To create an app from a git repository use:

`fhc apps create StoreFinder git://github.com/feedhenry/Store-Finder.git`


