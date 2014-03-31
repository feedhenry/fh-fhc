FHC & FeedHenry3
================

FHC (version 0.30.X) has quite a few changes for FeedHenry3, this document outlines those changes, and also what changes are left to do for full FH3 support. The bones of this document may also be used as a developer blog post for sometime around the FH3 launch.

Note in general that we will be using the same fhc tool to interface with both FH3 and older FH2 (i.e. there's not two versions of fhc). Over time, the older FH2 related code in fhc will be deprecated. The downside to this is users hitting FH2 will see the new commands (e.g. fhc --help will show the new FH3 commands below) but will obviously not be able to use them until they are migrated to FH3.

# Installation

The version of fhc in NPM is the old FH2 version, and this FHC3 version is still under active development. To install fhc for FH3, you must first uninstall your existing fhc:

* $ sudo npm rm -g fh-fhc

You have two choices on installing fhc for FH3, via git or via npm:

## Install via npm:

* $ sudo npm install -g fhc-test

## Install via git:

* $ git clone git@github.com:feedhenry/fh-fhc.git fh3 && cd fh-fhc
* $ npm install
* $ sudo npm link

Installing via git is best if you need to flick over and back between old and newer versions of fhc. For example, for switch back to the old version of fhc:

* $ git checkout master
* $ npm install

and likewise then to flick back to the FH3 version:

* $ git checkout fh3
* $ npm install

# The TODO list

The following is not feature complete for FH3 yet and is under active development:

* fhc local
* fhc connections
* fhc gitadmin
* fhc build-artifacts
* Updates to documentation

A full list of tickets is available in [Assembla](https://feedhenry.assembla.com/spaces/feedhenry-platform/tickets/5539-ngui---fhc-changes#/associations/ticket:).

# New FH3 Commands

The following is a list of new fhc commands, both NGUI & App Forms commands.

## fhc projects

```
$ fhc projects --help
fhc projects [list]
fhc projects create <project-title> [<template-id>]
fhc projects update <project-id> <prop-name> <value>
fhc projects read <project-id>
fhc projects delete <project-id>
fhc projects clone <project-id>
Note 'clone' does a 'git clone' of each each App in your Project into the current working directory.
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

## fhc connections

```
$ fhc connections --help
fhc connections <project-id>
```

## fhc artifacts

Build artifacts.

```
$ fhc artifacts --help
fhc artifacts <project-id> <app-id>
```

## fhc forms

```
$ fhc forms --help
fhc forms [list]
fhc forms create <form-file.json>
fhc forms update <form-file.json>
fhc forms get <form-id>
fhc forms delete <form-id>
fhc forms apps list
fhc forms apps get <app-id>
fhc forms apps update <app-id> <form-id>*
fhc forms apps create <app-title> <theme-id> <form-id>*
fhc forms formapps <form-id>
fhc forms groups [list]
fhc forms groups get <group-id>
fhc forms groups update <group-id> <group-name> <user-id>* <form-id>* <app-id>* <theme-id>*   # user-id and form-id should be a comma-seperated list of values
fhc forms groups create <group-name> <user-id>* <form-id>* <app-id>* <theme-id>*              # user-id and form-id should be a comma-seperated list of values
fhc forms groups delete <group-id>
fhc forms notifications [list] <form-id>
fhc forms notifications add <form-id> <email-address>
fhc forms notifications delete <form-id> <email-address>
```

## fhc submissions

```
$ fhc submissions --help
fhc submissions [list]
fhc submissions list app=<app-id> form=<form-id>
fhc submissions get <submission-id>
fhc submissions get <submission-id> <filename>.pdf
fhc submissions delete <submission-id>
fhc submissions getfile <filegroup-id> <outputfilename>
fhc submissions submitdata <submission-file.json>
fhc submissions submitfile <submission-id> <field-id> <file-id> <file>
fhc submissions complete <submission-id>
fhc submissions status <submission-id>
fhc submissions export file=<zip-file> app=<app-id> || form=<form-id>
fhc submissions template <app-id> <form-id>
```

## fhc themes

```
$ fhc themes --help
fhc themes [list]
fhc themes create <theme-file.json>
fhc themes update <theme-file.json>
fhc themes get <theme-id>
fhc themes delete <theme-id>
fhc themes app get <app-id>
fhc themes app set <app-id> <theme-id>
```

# Changes to existing commands

All of the 'App' related commands are different now in that they take an additional <project-id> parameter. Note that all other commands not listed below that take an <app-id> still work as normal (e.g. fhc start/stop/suspend/act/etc).

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
