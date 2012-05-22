fhc-messaging(1) -- FeedHenry Messaging Client
==============================================

## SYNOPSIS

    fhc messaging ping
    fhc messaging version
    fhc messaging stats
    fhc messaging topics
    fhc messaging topic <topic> <query>
    fhc messaging message <topic> <id>
    fhc messaging add <topic> <msg>
    
## DESCRIPTION

This command can be used to interact with the FeedHenry Message Server. The 'messaging' config property should be set to the url of the Message Server, i.e. 'fhc config edit' and set the messaging url as appropriate.  

## EXAMPLES
    Query messages in a topic:

    fhc messaging topic foo "bar=123&baz=345"

