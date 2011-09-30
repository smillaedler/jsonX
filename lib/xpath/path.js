var ResultSet = require("../query/resultSet"),
	Step = require("./step"),
	traverse = require("../util/traverse");

var Path = module.exports = function () {
	var self = this;
	
	this.type = "relative";
	this.step;
	
	// ---------------------------------------------
	// match takes a js object or a resultset of searchnodes and returns a resultset of matches
	// ---------------------------------------------

	this.matches = function (object) {
		var matchObject = function (object) {
			if (self.type == "absolute")
				return traverse(self.step.matches, object, new ResultSet());
			else if (self.type == "relative")
				return traverse(self.step.matches, object, new ResultSet(), false);					
		};
		
		object = self.step.expand(object);
		
		if (object instanceof ResultSet) {
			// iterate over nodes to apply match... traverse should really just act monadically on object/resultset :'(
			var totalRes = new ResultSet();
			object.each(function (i,e) {
				var result = matchObject(e);
				if (!result.isEmpty) result.each(function (i,e) {
					totalRes.push(e);
				});
			});
			return totalRes;				
		}
		else return matchObject(object);
	};
};

Path.unparse = function (object) {
	var path = new Path();
	path.type = object.type;
	path.step = Step.unparse(object.step);
	return path;
};