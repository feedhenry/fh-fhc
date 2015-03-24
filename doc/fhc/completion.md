fhc-completion(1) -- Tab Completion for FHC
===========================================

## SYNOPSIS

    . <(fhc completion)

## DESCRIPTION

Enables tab-completion in all fhc commands.

The synopsis above
loads the completions into your current shell.  Adding it to
your ~/.bashrc or ~/.zshrc will make the completions available
everywhere.

You may of course also pipe the output of fhc completion to a file
such as `/usr/local/etc/bash_completion.d/fhc` if you have a system
that will read that file for you.

When `COMP_CWORD`, `COMP_LINE`, and `COMP_POINT` are defined in the
environment, `fhc completion` acts in "plumbing mode", and outputs
completions based on the arguments.

