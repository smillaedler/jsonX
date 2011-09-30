var ResultSet = require("../query/resultSet"),
	SearchNode = require("../query/searchNode"),
	traverse = require('../util/traverse');

var AxisName = {},
	AxisSpecifier = module.exports = function () {
		this.name;
	};

AxisSpecifier.prototype.expand = function (searchNode) {
	return AxisSpecifier[this.name](searchNode);
}

AxisSpecifier.unparse = function (object) {
	var axis = new AxisSpecifier();
	this.name = object.name;
	return axis;
};

// ====================================================
// AxisName contains the functions :: SearchNode -> ResultSet to modify the input of a step matching 
//		function before traversal (which happens in Path)
// ====================================================

AxisName.ancestor = function (searchNode) {
	var resultSet = new ResultSet(),
		parent = searchNode.parent;
		
	while (parent) {
		resultSet.push(parent);
		parent = parent.parent;
	}
	
	return resultSet;
};

AxisName['ancestor-or-self'] = function (searchNode) {
	var resultSet = AxisName.ancestor(searchNode);
	resultSet.push(searchNode);
	return resultSet;
};
	
// doesn't really make sense for json
AxisName.attribute = function (searchNode) {
	return new ResultSet();
};
	
AxisName.child = function (searchNode) {
	var resultSet = new ResultSet();
	resultSet.push(searchNode)
	return new SearchNode();
};
	
AxisName.descendant = function (searchNode) {
	var resultSet = new ResultSet(),
		child = searchNode.node;
								
	while (child) {
		if (!(child instanceof SearchNode)) break;
		resultSet.push(child);
		child = child.node;
	}
	
	return resultSet;
};

AxisName['descendant-or-self'] = function (searchNode) {
	var resultSet = AxisName.descendant(searchNode);
	resultSet.push(searchNode);
	return resultSet;
};

// doesn't really make sense in an object as there is no order to the keys
// should work for an array though
AxisName.following = function (searchNode) {
	var resultSet = AxisName['following-sibling'](searchNode);
	
	resultSet.each(function (i,e) {
		traverse(function () { return true; }, e, resultSet);
	});
	
	return resultSet;
};

// should work for an array
AxisName['following-sibling'] = function (searchNode) {
	var resultSet = new ResultSet(),
		parent = searchNode.parent;
		
	if (parent.node instanceof Array) {
		for (i in parent.node) {
			if (i > parseInt(searchNode.key)) resultSet.push(parent.node[i]);
		}
	}
	
	return resultSet;
};
	
AxisName.namespace = function (searchNode) {
	return new ResultSet();
};
	
AxisName.parent = function (searchNode) {
	var resultSet = new ResultSet();
	resultSet.push(searchNode.parent);
	return resultSet;
};

AxisName.preceding = function (searchNode) {
	var resultSet = AxisName['preceding-sibling'](searchNode);
	
	resultSet.each(function (i,e) {
		traverse(function () { return true; }, e, resultSet);
	});
	
	return resultSet;
};

AxisName['preceding-sibling'] = function (searchNode) {
	var resultSet = new ResultSet(),
		parent = searchNode.parent;
		
	if (parent.node instanceof Array) {
		for (i in parent.node) {
			if (i < parseInt(searchNode.key)) resultSet.push(parent.node[i]);
		}
	}
	
	return resultSet;
};
	
AxisName.self = function (searchNode) {
	var resultset = new ResultSet();
	resultset.push(searchNode);
	return resultset;
};