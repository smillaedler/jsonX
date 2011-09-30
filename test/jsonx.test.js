var common = require("./common"),
	vows = require("vows"),
	should = require("should"),
	jsonx = require("../lib/jsonx");
	
require("./fixtures/jsonx.test.fixture");
	
vows.describe('jsonX').addBatch({
	'when': {
		'using a simple object': {
			topic: function () {
				return new jsonx.Doc(SimpleSearch);
			},
			'an xpath finds nodes': {
				topic: function (doc) {
					return doc.xpath("//node/test/here");
				},
				'we get two results': function (resultSet) {
					resultSet.length.should.equal(2);
					resultSet[0].node.should.equal("yay");
					resultSet[1].node.should.equal("yay two!");
				}
			},
			'an xpath fails to find nodes': {
				topic: function (doc) {
					return doc.xpath("//nonode/notest/fail");
				},
				'we get no results': function (resultSet) {
					resultSet.length.should.equal(0);
				}
			}
		},
		'searching for a path with a node test': {
			topic: function () {
				return new jsonx.Doc(SimpleNodeTest);
			},
			'applied to an object': {
				topic: function (doc) {
					return doc.xpath("//node[match=match]");
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