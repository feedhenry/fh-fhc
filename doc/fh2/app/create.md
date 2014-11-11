fhc-app-create(1) -- Create FeedHenry Applications
==============================================

## SYNOPSIS

    fhc app create <project-id> <app-title> [<template-id>]
    fhc app create <project-id> <app-title> <template-type> <git-repo> <git-branch>
    
## DESCRIPTION

This command can be used to create a new FeedHenry Application.

## Examples

    fhc app create 123454 foo cloud_nodejs https://github.com/foo.git
    fhc app create 123454 foo hello_world_mbaas_instance
    
