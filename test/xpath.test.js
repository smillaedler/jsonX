var common = require("./common"),
	vows = require("vows"),
	should = require("should"),
	parser = require("../lib/parser/xpath");
	
vows.describe('XPath Parser').addBatch({
	'when': {
		'parsing slashless relative': {
			topic: function () {
				return parser.parse("node");
			},
			'we get a relative path': function (object) {
				should.equal(object.constructor, Array);
				object.length.should.equal(1);
				object[0].should.include.keys("type", "name", "step");
				object[0].type.should.equal("relative");
			}
		},
		'parsing root absolute': {
			topic: function () {
				return parser.parse("//node")
			},
			'we get an absolute node': function (object) {
				should.equal(object.constructor, Array);
				object.length.should.equal(1);
				object[0].should.include.keys("type", "name", "step");
				object[0].type.should.equal("absolute");
			},
			'we get a path with one step': function (object) {
				should.equal(object[0].step.test.constructor, Object);
				object[0].step.test.test.should.equal("node");
				should.equal(object[0].step.specifier.constructor, Object);
				should.equal(object[0].step.predicates.constructor, Array);
			}
		},
		'parsing root relative': {
			topic: function () {
				return parser.parse("/node")
			},
			'we get a relative node': function (object) {
				should.equal(object.constructor, Array);
				object.length.should.equal(1);
				object[0].should.include.keys("type", "name", "step");
				object[0].type.should.equal("relative");
			},
			'we get a path with one step': function (object) {
				should.equal(object[0].step.test.constructor, Object);
				object[0].step.test.test.should.equal("node");
				should.equal(object[0].step.specifier.constructor, Object);
				should.equal(object[0].step.predicates.constructor, Array);
			}
		},
		'parsing multiple successive nodes': {
			topic: function () {
				return parser.parse("//node1/node2");
			},
			'we get a list with two paths': function (array) {
				array.length.should.equal(2);
				array[0].step.test.test.should.equal("node1");
				array[1].step.test.test.should.equal("node2");
			}
		},
		'parsing a legit axis specifier': {
			topic: function () {
				return parser.parse("//ancestor::*");
			},
			'we get an axis specifier': function (array) {
				should.equal(array[0].step.specifier.name, "axisSpecifier");
				array[0].step.specifier.type.should.equal("ancestor"); 
			}
		},
		'parsing an abbreviated axis "@"': {
			topic: function () {
				return parser.parse("//@node");
			},
			'we get an attribute axis': function (array) {
				should.equal(array[0].step.specifier.name, "axisSpecifier");
				array[0].step.specifier.type.should.equal("attribute"); 
			}
		},
		'parsing an abbreviated step ".."': {
			topic: function () {
				return parser.parse("/node/..");
			},
			'we get a parent axis': function (array) {
				array[1].step.specifier.type.should.equal("parent"); 
			}
		},
		'parsing an abbreviated step "."': {
			topic: function () {
				return parser.parse("/node/.");
			},
			'we get a parent axis': function (array) {
				array[1].step.specifier.type.should.equal("self"); 
			}
		}		
	}
}).export(module);