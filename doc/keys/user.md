fhc-keys-user(1) -- Manage User API Keys
========================================

## SYNOPSIS

    fhc keys user [list]
    fhc keys user add <label>
    fhc keys user read <label>
    fhc keys user update <old-label> <new-label>
    fhc keys user delete <label>
    fhc keys user target [<label>]
    
## DESCRIPTION

User API keys can be viewed, created and revoked in this section of the Account area. These keys can be used for accessing the Platform programmatically. They provide an alternative to the traditional username and password access method. When logged in with a username and password, a cookie is returned to the user, which is sent along with every subsequent request. A User API key is similar to a cookie, but sent in a header called _X-FH-AUTH-USER_. This header should be sent with every request.

By default, you will have no User API keys (with the exception of any system created keys e.g. _FH_MBAAS_API_key_). Multiple API keys can be created, so its a good idea to give each a unique label. The key value will be generated automatically. Labels can be modified later if required. If you no longer require a specific key or wish to prevent it from being used any more (for security reasons), simple Delete/Revoke it.
