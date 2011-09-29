
ALL_TESTS = $(shell find test/ -name '*.test.js')

run-tests:
	@env NODE_ENV=test vows --spec test/*.test.js

build-parser:
	@./node_modules/pegjs/bin/pegjs ./lib/parser/xpath.pegjs ./lib/parser/xpath.js

test:
	@$(MAKE) run-tests

parser:
	@$(MAKE) build-parser

test-cov:
	@TESTFLAGS=--cov $(MAKE) test

# test-leaks:
# 	@ls test/leaks/* | xargs node --expose_debug_as=debug --expose_gc

.PHONY: test