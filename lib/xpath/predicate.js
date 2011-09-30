var XPath = require("./xpath");

var Predicate = module.exports = function () {
	var self = this;
	
	this.path;
	this.operator;
	this.expr;
	
	this.matches = function (searchNode) {
		var compare = function (reducedPath, expr) {
				switch(self.operator) {
					case "=":
						return reducedPath == expr;
						break;
					case "!=":
						break;
					case "<":
						break;
					case ">":
						break;
					case "<=":
						break;
					case ">=":
						break;
				}
				return false;
			};
		
		// only for simplified version
		if (typeof self.path == "string") 
			var pathResult = (typeof searchNode == "string") ? searchNode : searchNode.node[self.path];
		// need to understand the real diff and mapping between [path=expr] [@path=expr]
		// also need to figure out how/when to get values vs resultSets in expr
		else {
			var pathResult = self.path.exec(searchNode);
		}
		
		return compare(pathResult, self.expr);
	};
};

Predicate.unparse = function (object) {
	var predicate = new Predicate();
	predicate.path = (typeof object.path == "string") ? object.path : XPath.unparse(object.path);
	predicate.operator = object.operator;
	predicate.expr = object.expr;
	return predicate;
};