## Easy steps:

* Fork the repo.

* Link the package:
 ```sh
 cd fh-fhc && npm link
  ```

 This will create a globally-installed symbolic link allowing changes to be made to code and testing of fhc commands without reinstalling the package.
* Make your changes in a new git branch created from master:
 ```sh
 git checkout -b my-fix-branch master
  ```

* Commit, push and send a PR!

## Detailed steps:
### Project Setup
* Fork the repo.

* Clone your forked repo locally

* Link the package:
 ```sh
 cd fh-fhc && npm link
  ```

 This will create a globally-installed symbolic link allowing changes to be made to code and testing of fhc commands without reinstalling the package.
* Setup git upstream remote
 ```sh
 git remote add upstream https://github.com/feedhenry/fh-fhc.git
  ```

### Making changes

* Make your changes in a new git branch created from master:
 ```sh
 git checkout -b my-fix-branch master
  ```

* Commit changes locally.

### Submitting a PR
* Push your branch to GitHub:
 ```sh
 git push origin my-fix-branch
  ```

* In GitHub, send a pull request to fh-fhc:master.

### After the pull request is merged
* Delete your branch locally and in origin
 ```sh
 git checkout master
  ```
 and
 ```sh
 git push origin --delete my-fix-branch
  ```
 and
 ```sh
 git branch -D my-fix-branch
  ```

 * Update master from upstream to pull your PR changes
  ```sh
 git pull upstream master
  ```