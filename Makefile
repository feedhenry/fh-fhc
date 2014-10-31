PACKAGE = fh-fhc
#
# Note: Get the Major/Release/Hotfix numbers from package.json.
# TODO: should really try use a JSON command line tool to do this,
# this could easily be done in Node but would introduce an additional
# build dependency.. 
#
PKG_VER:=$(shell grep version package.json| sed s/\"//g| sed s/version://g| sed s/-BUILD-NUMBER//g| tr -d ' '| tr -d ',') 
MAJOR:=$(shell echo $(PKG_VER)| cut -d '.' -f1)
RELEASE:=$(shell echo $(PKG_VER)| cut -d '.' -f2)
HOTFIX:=$(shell echo $(PKG_VER)| cut -d '.' -f3)

BUILD_NUMBER ?= DEV-VERSION
BUILD_NUMBER_INTERNAL = INTERNAL-$(BUILD_NUMBER)
VERSION = $(MAJOR).$(RELEASE).$(HOTFIX)
DIST_DIR  = ./dist
OUTPUT_DIR  = ./output
MODULES = ./node_modules
COV_DIR = ./lib-cov
RELEASE_FILE_INTERNAL = $(PACKAGE)-internal-$(VERSION)-$(BUILD_NUMBER_INTERNAL).tar.gz
RELEASE_FILE_EXTERNAL = $(PACKAGE)-$(VERSION)-$(BUILD_NUMBER).tar.gz
RELEASE_DIR = $(PACKAGE)-$(VERSION)-$(BUILD_NUMBER)

# BIG TODO - run 'test' in all target - need to fix tests!
all: clean npm_deps

doc_subfolders = $(shell find doc -type d \
									|sed 's|doc/|man1/|g' )

# work in progress
jshint: 
	jshint lib/*.js

etags:
	find . -name "*.js"|grep -v node_mod|grep -v lib-cov|grep -v output|xargs -e etags
	
npm_deps:
	npm install .

dist: npm_deps
	rm -rf $(MODULES)/ronn
	mkdir -p $(DIST_DIR) $(OUTPUT_DIR)/$(RELEASE_DIR)
	cp -r ./bin $(OUTPUT_DIR)/$(RELEASE_DIR)
	cp ./fh-fhc.js $(OUTPUT_DIR)/$(RELEASE_DIR)
	cp -r ./lib $(OUTPUT_DIR)/$(RELEASE_DIR)
	sed -i -e s/,\'messaging\'// $(OUTPUT_DIR)/$(RELEASE_DIR)/lib/fhc.js
	cp ./package.json $(OUTPUT_DIR)/$(RELEASE_DIR)
	echo "$(MAJOR).$(RELEASE).$(HOTFIX)-$(BUILD_NUMBER)" > $(OUTPUT_DIR)/$(RELEASE_DIR)/VERSION.txt
	sed -i -e s/BUILD-NUMBER/$(BUILD_NUMBER)/ $(OUTPUT_DIR)/$(RELEASE_DIR)/package.json
	tar -czf $(DIST_DIR)/$(RELEASE_FILE_EXTERNAL) -C $(OUTPUT_DIR) $(RELEASE_DIR)

clean:
	rm -rf $(DIST_DIR) $(OUTPUT_DIR) $(MODULES) $(COV_DIR)

.PHONY: clean
