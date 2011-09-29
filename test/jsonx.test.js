var common = require("./common"),
	vows = require("vows"),
	should = require("should"),
	x = require("../lib/jsonx");
	
require("./fixtures/jsonx.test.fixture");
	
vows.describe('jsonX').addBatch({
	'when': {
		'searching for a simple path': {
			topic: function () {
				return new x.path("//node/test/here");
			},
			'applied to an object': {
				topic: function (jsonx) {
					return jsonx.exec(SimpleSearch);
				},
				'we get two results': function (resultSet) {
					resultSet.length.should.equal(2);
					resultSet[0].node.should.equal("yay");
					resultSet[1].node.should.equal("yay two!");
				}
			},
			'applied to the wrong object': {
				topic: function (jsonx) {
					return jsonx.exec(SimpleFail);
				},
				'we get no results': function (resultSet) {
					resultSet.length.should.equal(0);
				}
			}
		},
		'searching for a path with a node test': {
			topic: function () {
				return new x.path("//node[match=match]");
			},
			'applied to an object': {
				topic: function (jsonx) {
					return jsonx.exec(SimpleNodeTest);
				},
				'we get the matching node': function (resultSet) {
					resultSet.length.should.equal(1);
					resultSet[0].should.include.keys("node");
					resultSet[0].node.match.should.equal("match");
				}
			}
		}
	}
}).export(module);