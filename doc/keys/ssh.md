fhc-keys-ssh(1) -- Manage User SSH Keys
======================================================

## SYNOPSIS

    fhc keys ssh [list]
    fhc keys ssh add <label> <key-file>
    fhc keys ssh delete <label>
    
## DESCRIPTION

Accessing your App repos via Git requires you to upload an SSH Public key. You can upload multiple keys if you have a different key on various machines, or want to allow someone access.
Your SSH key is typically located in:

```
~/.ssh/id_rsa.pub
```

Or, to generate a new key use:

```
ssh-keygen -t rsa -C "your_email@example.com"
```

**Important:** Any SSH key added here will have push & pull access to the Git repositories of every Project/App you can see in the Projects tab.</div>

**Important:** An SSH key can only be uploaded once. If you attempt to uploaded an already existing key, even in someone else's account, it will fail. This behaviour is essential for mapping keys to a Users account.
