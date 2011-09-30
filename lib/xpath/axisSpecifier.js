var ResultSet = require("../query/resultSet"),
	SearchNode = require("../query/searchNode");

var AxisSpecifier = module.exports = function () {
	// so an axis specifier actually takes the context node and provides a new node
	// ie, /node/ancestor::div takes context node, /node and looks for ancestors that are divs
	// so really, an axis specifier returns a resultset which gets narrowed down by nametest and then predicates
	this.AxisName = {
			ancestor: function (searchNode) {
				var resultSet = new ResultSet(),
					parent = searchNode.parent;
					
				while (parent) {
					resultSet.push(parent);
					parent = parent.parent;
				}
				
				return resultSet;
			},
			'ancestor-or-self': function (searchNode) {
				var resultSet = AxisName.ancestor(searchNode);
				resultSet.push(searchNode);
				return resultSet;
			},	
			// doesn't really make sense for json
			attribute: function (searchNode) {
				return new ResultSet();
			},	
			child: function (searchNode) {
				var resultSet = new ResultSet();
				resultSet.push(searchNode)
				return new SearchNode();
			},
			descendant: function (searchNode) {
				var resultSet = new ResultSet(),
					child = searchNode.node;
											
				while (child) {
					if (!(child instanceof SearchNode)) break;
					resultSet.push(child);
					child = child.node;
				}
				
				return resultSet;
			},	
			'descendant-or-self': function (searchNode) {
				var resultSet = AxisName.descendant(searchNode);
				resultSet.push(searchNode);
				return resultSet;
			},
			// doesn't really make sense in an object as there is no order to the keys
			// should work for an array though
			following: function (searchNode) {
				var resultSet = new ResultSet(),
					parent = searchNode.parent;
					
				if (parent.node instanceof Array) {
					for (i in parent.node) {
						if (i > parseInt(searchNode.key)) resultSet.push(parent.node[i]);
					}
				}
				
				return resultSet;
			},
			// should work for an array
			'following-sibling': function (searchNode) {
				var resultSet = new ResultSet(),
					parent = searchNode.parent;
					
				if (parent.node instanceof Array) {
					for (i in parent.node) {
						if (i > parseInt(searchNode.key)) resultSet.push(parent.node[i]);
					}
				}
				
				return resultSet;
			},	
			namespace: function (searchNode) {
				
				return new SearchNode();
			},	
			parent: function (searchNode) {
				
				return new SearchNode();
			},	
			preceding: function (searchNode) {
				
				return new SearchNode();
			},	
			'preceding-sibling': function (searchNode) {
				
				return new SearchNode();
			},	
			self: function (searchNode) {
				var resultset = new ResultSet();
				resultset.push(searchNode);
				return resultset;
			}
		};
		
	// apply the axis to the current searchNode
	this.expand = function (searchNode) {
		return AxisName[this.name](searchNode);
	};
};

AxisSpecifier.unparse = function (object) {
	var axis = new AxisSpecifier();
	this.name = object.name;
	return axis;
};