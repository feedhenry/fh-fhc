FHC & FeedHenry3
================

FHC has quite a few changes for FeedHenry3, this docment outlines those changes, and also what changes are left to do for full FH3 support. The bones of this document may also be used as a developer blog post for sometime around the FH3 launch.

# Installation

The version of fhc in NPM is the old FH2 version. You must first uninstall your existing fhc:

* $ sudo npm rm -g fh-fhc

You have two choices on installing fhc for FH3, via git or via npm:

1. via npm:
* $ sudo npm install -g fhc-test

2. via git:

* $ git clone git@github.com:feedhenry/fh-fhc.git 6039_services && cd fh-fhc
* $ npm install
* $ sudo npm link

Installing via git is best if you need to flick over and back between old and newer versions of fhc. For example, for switch back to the old version of fhc:

* $ git checkout master
* $ npm install

and likewise then to flick back to the FH3 version:

* $ git checkout 6039_services
* $ npm install

# The TODO list

The following is not feature complete for FH3 yet and is under active development:

* fhc local
* fhc connections
* fhc gitadmin
* fhc build-artifacts
* Updates to documentation

A full list of tickets is available in [Assembla}(https://feedhenry.assembla.com/spaces/feedhenry-platform/tickets/5539-ngui---fhc-changes#/associations/ticket:).

# New Commands

The following is a list of new fhc commands.

## fhc projects

```
$ fhc projects --help
fhc projects [list]
fhc projects create <project-title> [<template-id>]
fhc projects update <project-id> <prop-name> <value>
fhc projects read <project-id>
fhc projects delete <project-id>
where <project-id> is a project id
where <type> is a valid project type [default]
```

## fhc templates

```
$ fhc templates --help
fhc templates [list]
fhc templates [read] <template-id>
fhc templates init <template-id>
```

## fhc services

```
$ fhc services --help
fhc services [list]
fhc services create <service-title> [<template-id>]
fhc services update <service-id> <prop-name> <value>
fhc services read <service-id>
fhc services delete <service-id>
where <service-id> is a service id
where <type> is a valid service type [default]
```

## fhc ssh-keys

```
$ fhc ssh-keys --help
fhc sshkeys [list]
fhc sshkeys add <label> <key-file>
fhc sshkeys delete <label>
```

## fhc clone

```
$ fhc clone --help
fhc clone <project-id> <app-id> [<local-dir>]
```

## fhc ngui

This is a 'non public' command (i.e. end users won't see it in 'fhc --help'). It's a utility call which is used internally in other commands, and also for fh-art. Internally it may be handy to know if your targeted to an ngui domain or not. Note that you have to be logged in for 'fhc ngui' to know if you're hitting ngui or not.

```
$ fhc ngui
true
```

# Changes to existing commands

All of the 'App' related commands are different now in that they take an additional <project-id> parameter. 

## fhc apps

```
$ fhc apps --help

fhc apps [project-id]
```

## fhc read

```
$ fhc read --help
fhc read [project-id] <app-id>
```

## fhc delete

```
$ fhc delete --help
fhc delete <app-id>
```

## fhc import

```
$ fhc import --help

fhc import <project-id> <app-title> <app-template-type> [<zip-file> || <git-repo>]
Note: if no file or repo is specified, a bare git repo is created
```

## fhc update

```
$ fhc update --help
fhc update [project-id] <app-id> <property-name> <property-value>
```

## fhc <command> --help && fhc completion

Note that the usage flag, '--help', is ngui aware, i.e. if you are targeted to an ngui domain, it will show usage for the ngui, otherwise it will show usage for FH2. Ditto for bash completion, i.e. fhc read <tab> in ngui will complete projects, then apps, whereas fhc apps <tab> for an fh2 domain will just list apps.
