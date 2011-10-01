var AxisSpecifier = require("./axisSpecifier"),
	ResultSet = require('../query/resultSet'),
	NodeTest = require("./nodeTest"),
	Predicate = require("./predicate");
	
var Step = module.exports = function () {
	var self = this;
	
	this.specifier;
	this.test;
	this.predicates;

	// need to use "self" because we pass this function to traverse 
	this.matches = function (searchNode) {
		var test,
			predicates,
			next = function () { return true; },
			all = function (searchNode) {
				var success = true;
				for (i in self.predicates) {
					success = success && self.predicates[i].matches(searchNode);
					if (!success) break;
				}

				return success;
			};

		if (typeof self.test == "string")
			// simple test, will remove later
			test = function (searchNode) { return self.test == searchNode.key; };
		else if (self.test instanceof NodeTest)
			test = self.test.matches;
		else
			test = next;

		predicates = ((self.predicates instanceof Array) && self.predicates.length > 0) ? all : next;

		return test(searchNode) && predicates(searchNode);
	};
};

// takes a search node, and converts it into a resultset based on axis 
Step.prototype.expand = function (resultSet) {
	var self = this;
	if (resultSet instanceof ResultSet) {
		// check not necessary anymore...
		if (this.specifier instanceof AxisSpecifier) {
			var returnResultSet = new ResultSet();
			// monad would be nice here
			resultSet.each(function (i,e) {
				var res = self.specifier.expand(e)
				console.log(self.specifier.type, res);
				res.each(function (i,e) {
					returnResultSet.push(e);
				});
			});
			return returnResultSet;
		}
		else return resultSet;
	}
	else return new Error("type error: expand expects a ResultSet");
};

Step.unparse = function (object) {
	var step = new Step(),
		predicates = [];
	step.specifier = (typeof object.specifier == "string") ? object.specifier : AxisSpecifier.unparse(object.specifier);
	step.test = (typeof object.test == "string") ? object.test : NodeTest.unparse(object.test);
	for (var i in object.predicates) {
		predicates.push(Predicate.unparse(object.predicates[i]));
	}
	step.predicates = predicates;
	return step;
};