NAME = *

test:
	@$(MAKE) run-tests

parser:
	@$(MAKE) build-parser
	
run-tests:
	@env NODE_ENV=test vows --spec test/$(NAME).test.js

build-parser:
	@./node_modules/pegjs/bin/pegjs ./lib/parser/xpath.pegjs ./lib/parser/xpath.js	

# maybe useful later, probs not though:
# 	
# test-leaks:
# 	@ls test/leaks/* | xargs node --expose_debug_as=debug --expose_gc
# 

.PHONY: test