var ResultSet = require("../query/resultSet"),
	SearchNode = require('../query/searchNode'),
	Step = require("./step"),
	traverse = require("../util/traverse");

var Path = module.exports = function () {
	var self = this;
	
	this.type = "relative";
	this.step;
	
	// ---------------------------------------------
	// match :: ResultSet -> ResultSet
	// ---------------------------------------------

	this.matches = function (resultSet) {
		var matchObject = function (searchNode) {
			if (self.type == "absolute")
				return traverse(self.step.matches, searchNode, new ResultSet());
			else if (self.type == "relative")
				return traverse(self.step.matches, searchNode, new ResultSet(), false);					
		};
		
		// very inefficient, need to rearrange this whole section
		// console.log('\n\nbefore: ', object);
		resultSet = self.step.expand(resultSet);
		// console.log("\n\nafter: ", object);
		
		if (resultSet instanceof ResultSet) {
			var returnResult = new ResultSet();
			resultSet.each(function (i,e) {
				var result = matchObject(e);
				if (!result.isEmpty) result.each(function (i,e) {
					returnResult.push(e);
				});
			});
			return returnResult;				
		}
		else throw new Error("path.matches expects a ResultSet");
	};
};

Path.unparse = function (object) {
	var path = new Path();
	path.type = object.type;
	path.step = Step.unparse(object.step);
	return path;
};