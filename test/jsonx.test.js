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
		},
		'searching for a path with an axis': {
			topic: function () {
				return new jsonx.Doc(SimpleNodeTest);
			},
			'we can get parents': {
				topic: function (doc) {
					return doc.xpath("//node/parent::second");
				},
				'successfully': function (resultSet) {
					resultSet.length.should.equal(1);
					resultSet[0].key.should.equal("second");
					resultSet[0].node.node.match.should.equal("fail");
				}
			}
		},
		'searching for a path with a sibling axis': {
			topic: function () {
				return new jsonx.Doc(SiblingTest);
			},
			'we get siblings for an object': function (doc) {
				var rs = doc.xpath("//thing1/sibling::*");
				rs.length.should.equal(2);
				should.equal(true, rs[0].key == "thing2" || rs[1].key == "thing2");
				should.equal(true, rs[0].key == "thing3" || rs[1].key == "thing3");
			},
			'we get siblings for arrays': function (doc) {
				var rs = doc.xpath("//matchThing/sibling::*");
				rs.length.should.equal(2);
				rs[0].node.thing.should.equal("m2");
				rs[1].node.thing.should.equal("m3");
			},
			'we get following-siblings for arrays': function (doc) {
				var rs = doc.xpath("//matchThing2/following-sibling::*");
				rs.length.should.equal(2);
				rs[0].node.thing.should.equal("s3");
				rs[1].node.thing.should.equal("s4");				
			}
		},
		'searching for a path with a vertical axis': {
			topic: function () {
				return new jsonx.Doc(VerticalTest);
			},
			'we get ancestors': function (doc) {
				var rs = doc.xpath("//here/ancestor::*");
				rs.length.should.equal(5);
				var keys = common.allKeys(rs);
				keys.should.contain('thing');
				keys.should.contain('first');
				keys.should.not.contain('second');
				keys.should.contain('third');
				keys.should.contain('0');
				keys.should.not.contain('here');
			},
			'we get ancestors-and-self': function (doc) {
				var rs = doc.xpath("//here/ancestor-or-self::*");
				rs.length.should.equal(7);
				var keys = common.allKeys(rs);
				keys.should.contain('here');
			},
			'we get descendants': function (doc) {
				var rs = doc.xpath("//second/descendant::*");
				rs.length.should.equal(2);
				should.equal("t2", rs[1].node);
			},
			'we get descendant-and-self': function (doc) {
				var rs = doc.xpath("//second/descendant-or-self::*");
				rs.length.should.equal(3);
			}
		}
	}
}).export(module);