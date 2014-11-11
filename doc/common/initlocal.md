fhc-initlocal(1) -- Initialises Local Server files For Local Development
==========================================

## SYNOPSIS

    fhc initlocal <appid>

## DESCRIPTION

This command prepares the app in the current directory for running locally. It connects to your current fhc target and downloads the container file for the specified app. It also downloads the script and CSS files that are referenced by the app container, so that they are available when running the app locally.
The downloaded files are stored in the .fhclocal subdirectory


