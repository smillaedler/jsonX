var ResultSet = require("../query/resultSet"),
	SearchNode = require("../query/searchNode"),
	traverse = require('../util/traverse');

var AxisName = {},
	AxisSpecifier = module.exports = function () {
		this.type;
	};

// ---------------------------------------------
// expand :: SearchNode -> ResultSet
// ---------------------------------------------

AxisSpecifier.prototype.expand = function (searchNode) {
	return AxisName[this.type](searchNode);
}

AxisSpecifier.unparse = function (object) {
	var axis = new AxisSpecifier();
	axis.type = object.type;
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
	var resultSet = new ResultSet(),
		content = searchNode.node;
		
	if (content instanceof SearchNode) {
		console.log("already searchnode:", content);
		resultSet.push(content);
	}	
	else if ((content instanceof Array) && (content[0] instanceof SearchNode)) {
		console.log("array of searchnodes:", content);
		for (i in content) 
			resultSet.push(content[i]);
	}		
	else if (content instanceof Object || content instanceof Array) {
		for (var i in content) 
			resultSet.push(new SearchNode(content[i], searchNode.path + SearchNode.separator + i, content))
	}
	return resultSet;
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
	console.log("parent:", resultSet[0]);
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