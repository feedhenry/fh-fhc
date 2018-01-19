# Changelog
All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](http://keepachangelog.com/en/1.0.0/)
and this project adheres to [Semantic Versioning](http://semver.org/spec/v2.0.0.html).

## [4.2.1] - Wed Jan 17 2018
### Changed
- updated changelog for fh-fhc version >=2.16.3


## [4.2.0] - Tue Jan 16 16:03:28 2018 +0000
### Added
- added FHC CLI functionality for UPS


## [4.1.4] - Tue Oct 17 15:59:09 2017 +0100
### Removed
- removed FH3.md file because it is outdated


## [4.1.3] - Fri Jan 12 13:12:42 2018 +0000
### Changed
- Updated readme


## [4.1.2] - 
### Added
- added tests

### Changed
- change to not include app info by default


## [4.1.1] - 
### Changed
- changed so fhc requires just the branchname rather than /refs/head/<Branchname>


## [4.1.0] - 
### Removed
- Removes command completion


## [4.0.6] - 
### Changed
- Changed proxy timeout to millicore


## [4.0.5] - 
### Changed
- Moved request implementations defined in common.js to command files.


## [4.0.4] - 
### Changed
- Replaced deprecated `util.pump`


## [4.0.3] - 
### Changed
- updated dependencies:
```git
"dependencies": {
-    "cli-table": "0.0.2",
+    "cli-table": "0.3.1",
-    "moment": "2.0.0",
+    "moment": "2.18.1",
-    "nopt": "1.0.0",
+    "nopt": "4.0.1",
-    "os-locale": "1.4.0",
+    "os-locale": "2.1.0",
-    "request": "2.74.0",
-    "semver": "4.3.6",
+    "request": "2.82.0",
+    "semver": "5.4.1",
-    "underscore": "1.8.0",
+    "underscore": "1.8.3",
-    "yargs": "2.1.1"
+    "yargs": "9.0.1"
},
```
- updated dev-dependencies:
```git
"devDependencies": {
-    "fs-extra": "0.12.0",
+    "colors": "^1.1.2",
-    "grunt-concurrent": "1.0.0",
+    "grunt-concurrent": "2.3.1",
+    "grunt-contrib-clean": "^1.1.0",
+    "grunt-contrib-jshint": "^1.1.0",
-    "grunt-eslint": "^19.0.0",
+    "grunt-eslint": "^20.1.0",
-    "grunt-plato": "1.0.0",
-    "grunt-shell": "0.6.4",
+    "grunt-shell": "2.1.0",
-    "grunt-zanata-js": "1.1.0",
+    "grunt-zanata-js": "1.3.2",
-    "istanbul": "0.2.7",
+    "istanbul": "0.4.5",
-    "load-grunt-tasks": "0.4.0",
+    "load-grunt-tasks": "3.5.2",
-    "nock": "8.0.0",
+    "nock": "9.0.17",
-    "time-grunt": "0.3.1",
+    "time-grunt": "1.4.0",
},
```


## [4.0.2] - Mon Oct 16 18:57:02 2017 +0100
### Added
- Added Jenkinsfile
- Added app-types to help

### Changed
- Added deprecation notices to any auth commands that exist

### Removed


## [4.0.1] - Tue Sep 26 08:50:18 2017 +0100
### Changed
- Improved appearance of error message for invalid git-* parameter
- Extract Methods to reduce the complexity


## [4.0.0] - Fri Sep 22 17:18:42 2017 +0100
### Changed
- Remove OTA command - It was added into the build command

### Removed
- Remove common dir ref


## [3.2.0] - Tue Sep 19 16:50:44 2017 +0100
### Added
- Added unit tests

### Changed
- Change the build cmd to follow the V3 standard


## [3.1.3] - Wed Sep 13 19:04:33 2017 +0100
### Added
- Added unit tests

### Changed
- Change the cmd fhc admin-users to follow the V3 standard 


## [3.1.2] - Wed Sep 13 18:55:44 2017 +0100
### Added
- Added unit tests

### Changed
- Change the cmd fhc admin-storeitems to follow the V3 standard


## [3.1.1] - Tue Sep 5 22:19:34 2017 +0100
### Added
- Added unit tests

### Changed
- Change the cmd auth to follow the V3 standard


## [3.1.0] - Tue Sep 5 22:06:12 2017 +0100
### Added
- Added unit tests

### Changed
- Updates .pot file via grunt potupload
- Change the cmd  appinit to follow the V3 standard

### Removed
- Removed the initlocal command


## [3.0.8] - Tue Sep 5 14:47:47 2017 +0100
### Changed
- Moved the commands into common dir which are used just internally via ops to the internal dir


## [3.0.7] - Tue Sep 5 09:40:39 2017 +0200
### Changed
- Not 2xx status when creating hello_world_project via fhc
- FIX the unit test of the command ping because it was not be executed before

## [3.0.6] - Fri Sep 1 14:21:58 2017 +0100
### Changed
- Fix bug related to the import of zip files
- Fixed tests in the root of fh3 directory not being called into the unit tests


## [3.0.5] - Thu Aug 17 10:38:02 2017 +0100
### Changed
- Adapt output of fhc connections command


## [3.0.4] - Wed Aug 16 10:08:44 2017 +0100
### Changed
- Change the cmd $fhc version to follow the V3 standard


## [3.0.3] - Sun Aug 13 16:30:59 2017 +0100
### Changed
- Improved output of the boolean results of the tables for console into FHC


## [3.0.2] - Fri Aug 11 13:27:40 2017 +0100
### Changed
- Adapts the command fhc credentials list to return result in JSON format


## [3.0.1] - Fri Aug 11 12:03:44 2017 +0100
### Added
- Added unit tests

### Changed
- Change the cmd  import to follow the V3 standard


## [3.0.0] - Fri Aug 11 11:53:44 2017 +0100
__*note*__ breaking API changes introduced in v3 of fh-fhc, where support for v2 commands are removed  
### Added
- Added unit tests

### Changed
- Fixed error in creating project, service and application after changes made in the templates
- Fixed fh-fhc upload app binary to use proxy setting
- Changed the cmd secure endpoints to follow the V3 standard

### Removed
- Removed support of V2 commands
- Removed the cmd fhc local which was replaced by grunt and was not working currently


## [2.19.3] - Tue Aug 8 21:33:23 2017 +0100
### Added
- Added unit tests

### Changed
- Change the cmds eventalert & to follow the V3 standard


## [2.19.2] - Tue Aug 8 21:06:51 2017 +0100
### Changed
- Fixed issue where unable to build via FHC when the parameter download = true is used


## [2.19.1] - Wed Aug 2 13:23:47 2017 +0100
### Added
- Added unit tests

### Changed
- Change the cmd devices to follow the V3 standard


## [2.19.0] - Wed Aug 2 13:09:00 2017 +0100
### Added
- Added unit tests

### Changed
- Change the cmd admin store to follow the V3 standard


## [2.18.7] - Wed Aug 2 11:46:43 2017 +0100
### Added
- Added unit tests

### Changed
- Change the cmd $fhc templates to follow the V3 standard


## [2.18.6] - Wed Aug 2 11:43:01 2017 +0100
### Added
- Added unit tests

### Changed
- Change the cmd $fhc session to follow the V3 standard

## [2.18.5] - Wed Aug 2 11:24:03 2017 +0100
### Changed
- Updates fhc build to work with self-managed build farm
- Change to generate QR code


## [2.18.4] - Wed Aug 2 11:01:09 2017 +0100
### Changed
- Fix to resolve fhc apps [list] command is not accepting optional word list


## [2.18.3] - Wed Aug 2 10:46:33 2017 +0100
### Changed
- Fix: fhc env push command does not work on dedicated environment


## [2.18.2] - Wed Aug 2 10:34:56 2017 +0100
### Changed
- Fix: Tue Aug 1 20:59:59 2017 +0100


## [2.18.1] - Fri Jul 28 08:01:35 2017 -0300
### Changed
- Fix: fhc is missing the command resources list command


## [2.18.0] - Tue Jul 25 11:19:43 2017 +0200
__*note:*__ v2.18.0 was a large minor version update that involved a lot of changes to add various commands that meet v3 standards, along with accompanying unit tests. In addition files CRUDL commands were removed, support for versions of node >=4.4 was enabled, and linting support was added.  
### Added
- Adds verification for environment ids
- Adds eslint file containing rules that don't throw any errors (uses grunt-eslint)
- Adds unit tests for admin teams commands
- Adds unit tests for admin status command
- Adds unit tests for fhc services command
- Adds FHC commands for credentials (credential bundles)
- Add GitHub links to issue tracker to the package.json and fixes npm information
- Adds unit tests for fhc connections command
- Adds unit tests for fhc admin domains commands
- Adds unit tests for fhc ping command
- Adds unit tests for fhc artifacts command
- Adds unit tests for fhc user command
- Adds unit tests for fhc cmd -v
- Adds unit tests for fhc cmd shorturl
- Adds unit tests for fhc cmd stats
- Adds unit tests for fhc cmd call
- Adds unit tests for fhc cmd preview
- Adds unit tests for fhc cmd notifications
- Adds notification that FHC for RHMAP V2 is deprecated and will be not supported in the next version
- Adds unit tests for fhc cmd git
- Adds unit tests for fhc projects command
- Adds unit tests for $fhc app update command
- Adds unit tests for fhc cmd resources
- Adds unit tests for fhc cmds env *
- Adds custom home directory support
- Adds unit tests for fhc cmd keys
- Adds unit tests for fhc cmd admin-auditlog
- Adds unit tests for cmd fhc policies
- Adds unit tests for cmd fhc storeitemgroups


### Changed
- Fixed primary code style errors
- Corrects link in npm page of FHC Cli tool to repo
- Corrects message error where 'tag' parameter is shown when the build command is executed
- Fixes where fhversion defaults to 2 in .fhcrc if not logged into studio first
- Fix where some FHC commands arguments don't support Aliases
- Fixes where FHC runtimes command does not work
- Updates fh-fhc to use common ESLint rules
- Fix admin status command and updates it to V3 standard
- Add command `fhc services` to V3 standard
- Add command `fhc clone` to V3 standard
- Add command `fhc connections` to V3 standard
- Add commands from "fhc admin domains" to V3 standard
- Add command `fhc ping` to V3 standard
- Fixes where fhc services list --json doesn't work properly
- Fixes where re-deployment via fhc get stuck with incorrect runtime specified
- Add command `fhc artifacts` to V3 standard
- Change the cmd user to follow the V3 standard
- Change the cmd -v update to follow the V3 standard 
- Change the cmd shorturl to follow the V3 standard
- Change the cmd stats to follow the V3 standard
- Change the cmd call to follow the V3 standard
- Changed output of call command to be backward compatible with v2 implementation
- Change the cmd preview to follow the V3 standard
- Change the cmd notifications to follow the V3 standard
- Fixes issue with command fhc runtimes and the dev environment
- Passes into the post commands the argvs used to executed the commands
- Improved output data when the commands has table in the output and they are used as dependency
- Change the cmd git to follow the V3 standard
- Add command fhc projects to V3 standard
- Change the cmd $fhc app update to follow the V3 standard
- Change the cmd resources to follow the V3 standard
- Change the cmds $fhc env * to follow the V3 standard
- Updates FHC to honour the mask-value options for environment variables
- Change the cmd keys to follow the V3 standard
- Change the cmd admin-auditlog to follow the V3 standard
- Change the cmd fhc policies to follow the V3 standard
- Change the cmd fhc storeitemgroups to follow the V3 standard
- Fixes issue with FHC showing help usage as error when it should not be

### Removed
- Remove files CRUDL commands from fh-fhc
- Removes restriction on fh-fhc using versions of node >= 4.4
- Removes the Warning: sys is deprecated. Uses util instead. from FHC tool
- Removes doxy related files from fh-fhc
- Removes jshint


## [2.17.5] - Tue Apr 25 10:42:36 2017 +0100
### Changed
- moved a message to error in file download
- added log message


## [2.17.4] - Tue Mar 28 16:09:29 2017 +0100
### Added
- Added a DockerFile

### Changed
- Updated .gitignore to ignore .vscode
- Updated README for Docker


## [2.17.3] - Tue Feb 7 09:03:41 2017 +0000
### Changed
- Filter selected apps from templates like fh-ngui


## [2.17.2] - Mon Jan 30 14:13:42 2017 +0000
### Removed
- Removed unused destination for fhc configuration
- Removed deprecated destination from docs


## [2.17.1] - Mon Jan 16 11:18:38 2017 +0000
### Added
- Added in checks to admin domains to validate missing options
- Added ability to allow users to filter project listing by author email


### Changed
- Updated translations
- Changes npm tag in version command
- Fixed status which had the same problem with rendering usage when no args passed.
- Updated request payload to allow import of cloud app from git repo
- Allows type MBAAS for fhc policies create. Updated usage also
- Fixes validation on admin-policies args length and passing correct args to update function
- Fixes zanata grunt task that previously broke the build 
- Defaults to HEAD if user doesn't pass a git hash
- App stage - default to master and update usage to show default
- Fixes error where `fhc clusterprops` appears as a subcommand of the `error` command


## [2.17.0] - Mon Dec 19 10:37:00 2016 +0000
### Added
- Cordova Light Migration Tool


## [2.16.5] - Thu Dec 8 11:03:52 2016 +0000
### Changed
- Fixed issue where returning immediately from callback if doc is not found


## [2.16.4] - Tue Dec 6 15:18:33 2016 +0000
### Removed
- Removes support for node versions <0.10.0 (previously we supported node versions >=0.8)

---

# Previous Changelog (<= 2.16.3)

## [2.16.3]
* FH-2850 - Allow team assignment when creating a user with fhc
* Fixed import of zip file

## [2.6.0] - 2016-03-11
* RHMAP-1722 - Data Sources APIs

## [2.3.0] - 2016-01-09

* RHMAP-3751 add decoupled property to mbaas create update

## [2.1.1] - 2015-12-28
------------------------------------------------------
* Use grunt-fh-build where possible, to clean up Gruntfile.js


## [2.1.0] - 2015-11-23
* RHMAP-2926 - Unable to tail logs using FHC
* RHMAP-2746 - Only disable autodeploy if it's value is set to false
* RHMAP-3082 - Fix an issue with autodeploy when stage apps
* RHMAP-3085 - Fix an issue with export form submissions
* Environment should be optional when creating projects/services/apps
* RHMAP-2482 - Expose semver version of core in fhc version
* RHMAP-2746 - Add support for configuring auto deploy

## [2.0.5] - 2015-10-22
------------------------------------------------------
* RHMAP-2648
** Change downgrade message to a version that works
** Set publish tag to `latest-2`
** Look for `latest-2` tag when checking for updates
** Change -BUILD-NUMBER to +BUILD-NUMBER

## [2.0.4] - 2015-09-03
------------------------------------------------------
* FH-1941 - Fixed Importing Apps From Github

## [2.0.3] - 2015-08-28
------------------------------------------------------
* FH-1881 - Fix shrinkwrap file

## [2.0.2] - 2015-08-25
------------------------------------------------------

* FH-1844 - Fix for undefined required version.

## [2.0.1] - 2015-08-20
------------------------------------------------------
* FH-1709 - Fix argument passing for apps create

## [2.0.0] - 2015-08-19
------------------------------------------------------
* FH-42 - Appforms LCM Functionality. New API For Appforms Functions

## [1.1.5] - 2015-07-16
------------------------------------------------------
* Shrinkwrap was invalid - re-shrinkwrapped

## [1.1.4] - 2015-06-19
------------------------------------------------------
* Cache the current version of fhc so that the cached data will be invalidated if fhc version is changed.

## [1.1.3] - 2015-06-16
------------------------------------------------------
* Fix the version check. Use npm.js instead.

## [1.1.2] - 2015-06-16
------------------------------------------------------
* Fix typo in command help: andriod -> android

## [1.1.1] - 2015-06-11
------------------------------------------------------
* FH-353 - reduce polling interval

## [1.1.0] - 2015-05-13
------------------------------------------------------
* FHMAP-224 - Adding support for domain per user

## [1.0.2] - 2015-04-21
------------------------------------------------------
* Fix typo in new version available message
* Add shrinkwrap file to tarball

## [1.0.0] - 2015-03-20
------------------------------------------------------
* 7945 - Deprecate `--live` environment flag in favor of a mandetory `--env=<env>` flag.
* Support for admin teams commands
* Fixes numeric alias'd yargs parsing
* Refactor substantial portion of fhc core
* Better docs & support for use as a module

## [0.31.5] - 2015-02-11 - IR246
-------------------------------------------------------
* FHCLI-1 - Fix display of git url in apps list

## [0.31.4] - 2014-11-18 - IR241
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

## [0.31.3] - 2014-10-24 - IR239
-------------------------------------------------------

* 8109 - Add submission sanitation to forms get Submission and list Submissions.

## [0.31.2] - 2014-08-22 - IR234
-------------------------------------------------------
* 6364 - Misc fh-art related fixes:
  * fix for in-memory config
  * new 'ngui enable/disable' commands

## [0.31.1] - 2014-09-01 - IR235
------------------------------------------------------
* 7904 - fix clientPort param name in docs/local.md

## [0.31.0] - 2014-06-27 - IR230
------------------------------------------------------
* 7432 - Remove the fhc clone command in favour of fhc projects clone

## [0.30.1] - 2014-05-27 - IR228
------------------------------------------------------
* 7277 - 'fhc projects clone' returns info in stderr field instead of stdout

## [0.30.0] - 2014-03-26 - IR224
------------------------------------------------------
* FH3 support
* 7044 add export to fhc forms

## [0.14.1- 2014-04-09 - IR225
------------------------------------------------------
* 6687-Fix close stream bug

## [0.14.0- 2014-03-20 - IR224
------------------------------------------------------
* Choose cordova version
* zendesk-3351 Incorrect url being returned from fhc embed

## [0.12.1] - 2014-01-08 - IR219
------------------------------------------------------
* Ticket #5641 - add app forms groups to fhc
* Ticket #5645 - add app forms themes and apps to groups in fh-art and fh-fhc

## [0.12.0] - 2013-11-08 - IR214
------------------------------------------------------
* Ticket 5081 fhc forms command

## [0.11.5] - 2014-01-28 - IR220
------------------------------------------------------
* Add better support for http proxy

## [0.11.4] - 2014-01-03 - IR218
------------------------------------------------------
* Add support for url shortener

## [0.11.3] - 2013-12-11 - IR216
------------------------------------------------------
* Add windowsphone as one if the fhc build targets

## [0.11.2] - 2013-12-03 - IR216
------------------------------------------------------
* Add --registry flag to fhc, specifies which npm repo to use during a stage

## [0.11.1] - 2013-10-23 - IR213
------------------------------------------------------
* Support Ticket #2162 Improve usage messages for fhc local

## [0.11.0] - 2013-10-03 - IR211
------------------------------------------------------
* Support Ticket #1787 fhc build should default the version in the same way that the studio does

## [0.10.0] - 2013-08-08 - IR207
------------------------------------------------------
* Add support for managing cloud environments

## [0.9.3] - 2013-07-08 - IR205
---------------------------------------------------
* Add support for managing cloud event alerts

## [0.9.2] - 2013-06-13 - IR203
-----------------------------------------------------
* Tickey 4099 add fhc runtimes command and change fhc stage to accept a runtime

## [0.8.2] - 2013-06-14 - IR203
-----------------------------------------------------

* Support Ticket #1754 fhc initlocal return error if 404 on get container.


## [0.8.1] - 2013-06-13 - IR203
-----------------------------------------------------

* Ticket 4088 Upgrade fh-fhc to node 0.10x: Fix for 'DEPTH_ZERO_SELF_SIGNED_CERT' issue, see: https://github.com/mikeal/request/issues/418

## [0.8.0] - 2013-05-22 - IR202
-----------------------------------------------------

* Ticket 3077: fhc login json parse exception
