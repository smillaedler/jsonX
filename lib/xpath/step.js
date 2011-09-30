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
Step.prototype.expand = function (searchNodeOrResultSet) {
	var self = this;
	if (searchNodeOrResultSet instanceof ResultSet) {
		if (this.specifier instanceof AxisSpecifier) {
			var resultSet = new ResultSet();
			// monad would be nice here
			searchNodeOrResultSet.each(function (i,e) {
				self.specifier.expand(e).each(function (i,e) {
					resultSet.push(e);
				});
			});
			return resultSet;
		}
		else return searchNodeOrResultSet;
	}
	else if (this.specifier instanceof AxisSpecifier) {
		return this.specifier.expand(searchNodeOrResultSet);
	}
	else return searchNodeOrResultSet;
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