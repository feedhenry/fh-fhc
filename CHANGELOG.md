# 2.16.3
* FH-2850 - Allow team assignment when creating a user with fhc
* Fixed import of zip file

# 2.6.0 - 2016-03-11 -  Niall Donnelly

* RHMAP-1722 - Data Sources APIs

# 2.3.0 - 2016-01-09 -  CBrookes

* RHMAP-3751 add decoupled property to mbaas create update

# 2.1.1 - 2015-12-28 -  Gerard Ryan
------------------------------------------------------
* Use grunt-fh-build where possible, to clean up Gruntfile.js


# 2.1.0 - 2015-11-23 - Wojciech Trocki, Wei Li
* RHMAP-2926 - Unable to tail logs using FHC
* RHMAP-2746 - Only disable autodeploy if it's value is set to false
* RHMAP-3082 - Fix an issue with autodeploy when stage apps
* RHMAP-3085 - Fix an issue with export form submissions
* Environment should be optional when creating projects/services/apps
* RHMAP-2482 - Expose semver version of core in fhc version
* RHMAP-2746 - Add support for configuring auto deploy

Release 2.0.5 - 2015-10-22 - David Martin
------------------------------------------------------
* RHMAP-2648
** Change downgrade message to a version that works
** Set publish tag to `latest-2`
** Look for `latest-2` tag when checking for updates
** Change -BUILD-NUMBER to +BUILD-NUMBER

Release 2.0.4 - 2015-09-03 - Niall Donnelly
------------------------------------------------------
* FH-1941 - Fixed Importing Apps From Github

Release 2.0.3 - 2015-08-28 - Martin Murphy
------------------------------------------------------
* FH-1881 - Fix shrinkwrap file

Release 2.0.2 - 2015-08-25 - Niall Donnelly
------------------------------------------------------

* FH-1844 - Fix for undefined required version.

Release 2.0.1 - 2015-08-20 - Shannon Poole
------------------------------------------------------
* FH-1709 - Fix argument passing for apps create

Release 2.0.0 - 2015-08-19 - Niall Donnelly
------------------------------------------------------
* FH-42 - Appforms LCM Functionality. New API For Appforms Functions

Release 1.1.5 - 2015-07-16 - Jason Madigan
------------------------------------------------------
* Shrinkwrap was invalid - re-shrinkwrapped

Release 1.1.4 - 2015-06-19 - Wei Li
------------------------------------------------------
* Cache the current version of fhc so that the cached data will be invalidated if fhc version is changed.

Release 1.1.3 - 2015-06-16 - Wei Li
------------------------------------------------------
* Fix the version check. Use npm.js instead.

Release 1.1.2 - 2015-06-16 - Gerard Ryan
------------------------------------------------------
* Fix typo in command help: andriod -> android

Release 1.1.1 - 2015-06-11 - Craig Brookes
------------------------------------------------------
* FH-353 - reduce polling interval

Release 1.1.0 - 2015-05-13 - Craig Brookes, Jason Madigan
------------------------------------------------------
* FHMAP-224 - Adding support for domain per user

Release 1.0.2 - 2015-04-21 - Gerard Ryan
------------------------------------------------------
* Fix typo in new version available message
* Add shrinkwrap file to tarball

Release 1.0.0 - 2015-03-20 - Cian Clarke
------------------------------------------------------
* 7945 - Deprecate `--live` environment flag in favor of a mandetory `--env=<env>` flag.
* Support for admin teams commands
* Fixes numeric alias'd yargs parsing
* Refactor substantial portion of fhc core
* Better docs & support for use as a module

Release 0.31.5 - 2015-02-11 - IR246 - Martin Murphy
-------------------------------------------------------
* FHCLI-1 - Fix display of git url in apps list

Release 0.31.4 - 2014-11-18 - IR241 - David Martin
-------------------------------------------------------
* 8269 - Added cacheKey polling for Project create
* Fix fh2 regressions
* Updated fhc completion support
* Fix blank canvas login experience.
* Fix user agent string in some requests
* Fix fhcrc init error handling
* Bugfix of argv handling in some commands
* 8593 - Split `fhc app hosts` command into fh2 & fh3 version, where fh3 version requires an environment
* 8600 - Using fh3 hosts endpoint for fh3 ping command
* 8614 - Added user-agent to header to bypass CSRF
* Fixed hardcoded hosts cmd domain
* 8591 - Fixed issue with auto download of App builds

Release 0.31.3 - 2014-10-24 - IR239 - Niall Donnelly
-------------------------------------------------------

* 8109 - Add submission sanitation to forms get Submission and list Submissions.

Release 0.31.2 - 2014-08-22 - IR234 - Damian Beresford
-------------------------------------------------------
* 6364 - Misc fh-art related fixes:
  * fix for in-memory config
  * new 'ngui enable/disable' commands

Release 0.31.1 - 2014-09-01 - IR235 - Martin Murphy
------------------------------------------------------
* 7904 - fix clientPort param name in docs/local.md

Release 0.31.0 - 2014-06-27 - IR230 - Martin Murphy
------------------------------------------------------
* 7432 - Remove the fhc clone command in favour of fhc projects clone

Release 0.30.1 - 2014-05-27 - IR228 - Damian Beresford
------------------------------------------------------
* 7277 - 'fhc projects clone' returns info in stderr field instead of stdout

Release 0.30.0 - 2014-03-26 - IR224 - Damian Beresford
------------------------------------------------------
* FH3 support
* 7044 add export to fhc forms

Release 0.14.1- 2014-04-09 - IR225 - Martin Murphy / James Kelly
------------------------------------------------------
* 6687-Fix close stream bug

Release 0.14.0- 2014-03-20 - IR224 - Wei Li / James Kelly
------------------------------------------------------
* Choose cordova version
* zendesk-3351 Incorrect url being returned from fhc embed

Release 0.12.1 - 2014-01-08 - IR219 - Martin Murphy
------------------------------------------------------
* Ticket #5641 - add app forms groups to fhc
* Ticket #5645 - add app forms themes and apps to groups in fh-art and fh-fhc

Release 0.12.0 - 2013-11-08 - IR214 - Damian Beresford
------------------------------------------------------
* Ticket 5081 fhc forms command

Release 0.11.5 - 2014-01-28 - IR220 - Damian Beresford
------------------------------------------------------
* Add better support for http proxy

Release 0.11.4 - 2014-01-03 - IR218 - Martin Murphy
------------------------------------------------------
* Add support for url shortener

Release 0.11.3 - 2013-12-11 - IR216 - Wei Li
------------------------------------------------------
* Add windowsphone as one if the fhc build targets

Release 0.11.2 - 2013-12-03 - IR216 - Damian Beresford
------------------------------------------------------
* Add --registry flag to fhc, specifies which npm repo to use during a stage

Release 0.11.1 - 2013-10-23 - IR213 - Wei Li
------------------------------------------------------
* Support Ticket #2162 Improve usage messages for fhc local

Release 0.11.0 - 2013-10-03 - IR211 - Damian Beresford
------------------------------------------------------
* Support Ticket #1787 fhc build should default the version in the same way that the studio does

Release 0.10.0 - 2013-08-08 - IR207 - Damian Beresford
------------------------------------------------------
* Add support for managing cloud environments

Release 0.9.3 - 2013-07-08 - IR205 - Wei Li
---------------------------------------------------
* Add support for managing cloud event alerts

Release 0.9.2 - 2013-06-13 - IR203 - Craig Brookes
-----------------------------------------------------
* Tickey 4099 add fhc runtimes command and change fhc stage to accept a runtime

Release 0.8.2 - 2013-06-14 - IR203 - Alan Moran
-----------------------------------------------------

* Support Ticket #1754 fhc initlocal return error if 404 on get container.


Release 0.8.1 - 2013-06-13 - IR203 - Damian Beresford
-----------------------------------------------------

* Ticket 4088 Upgrade fh-fhc to node 0.10x: Fix for 'DEPTH_ZERO_SELF_SIGNED_CERT' issue, see: https://github.com/mikeal/request/issues/418

Release 0.8.0 - 2013-05-22 - IR202 - Damian Beresford
-----------------------------------------------------

* Ticket 3077: fhc login json parse exception
