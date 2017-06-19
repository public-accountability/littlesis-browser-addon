VERSION := $(shell cat manifest.json | jq -r '.version')
LOCALHOST_URL = 'http:\/\/localhost:8080'
PROD_URL = 'https:\/\/littlesis.org'
PEM_PATH = $(shell readlink -f ~/littlesis/littlesis-browser-addon.pem)

package: littlesis-browser-addon-$(VERSION)
	bin/package littlesis-browser-addon-$(VERSION) $(PEM_PATH)
	rm -rf littlesis-browser-addon-$(VERSION)

littlesis-browser-addon-$(VERSION):
	@echo "Packaging $(VERSION)"
	mkdir -v -p $@
	find . -type d \( -path ./.git -o -path ./test -o -path ./bin \) -prune -o -not -name "Makefile" -not -name ".gitignore" -type f -print | xargs cp --parents -t $@
	sed -i "s/$(LOCALHOST_URL)/$(PROD_URL)/g" $@/js/constants.js

clean:
	rm -rf littlesis-browser-addon-$(VERSION)
	rm -rf *.crx


.PHONY: package clean
