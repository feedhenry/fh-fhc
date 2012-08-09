fhc-admin-policies(1) -- Administer Auth Policies
=================================================

## SYNOPSIS

    fhc policies list
    fhc policies create <policy-id> <policy-type> <config> [<check-user-exists>] [<check-user-approved>]
    fhc policies update <guid> <policy-id> <policy-type> <config> [<check-user-exists>] [<check-user-approved>]
        where <policy-type> is one of: OAUTH1 | OAUTH2 | LDAP | OPENID | FEEDHENRY
        where <config> is a json object corresponding to the policy type, e.g.
              for OAuth2: "{"clientId": "1234567890.apps.example.com",  "clientSecret": "Wfv8DQw80hhyaBqnW37x5R23", "provider": "GOOGLE"}"
              for LDAP: "{"authmethod": "simple", "url": "ldap://foo.example.com:389, "dn": "ou=people,dc=example,dc=com", "dn_prefix": "cn", "provider": "LDAP"}
                           authmethod can be one of: "simple", "DIGEST-MD5", "CRAM-MD5", or "GSSAPI"
        where <check-user-exists> is one of: true | false. The default here is 'false'.
        where <check-user-approved> is one of: true | false. The default here is 'false'.
    fhc policies delete <guid>
    fhc policies read <policy-id>
    fhc policies users <policy-id>
    fhc policies addusers <policy-guid> <user-id>*
    fhc policies removeusers <policy-guid> <user-id>*

    
## DESCRIPTION

This command allows you to Administer Auth Policies on the FeedHenry Platform. For more information, see http://docs.feedhenry.com/v2/authadmin.html.