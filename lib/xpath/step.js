var AxisSpecifier = require("./axisSpecifier"),
	NodeTest = require("./nodeTest"),
	Predicate = require("./predicate");
	
var Step = module.exports = function () {
	var self = this,
		next = function () { return true; },
		all = function (searchNode) {
			var success = true;
			for (i in self.predicates) {
				success = success && self.predicates[i].matches(searchNode);
				if (!success) break;
			}
			
			return success;
		};
	
	this.specifier;
	this.test;
	this.predicates;
	
	// takes a search node, and converts it into a resultset based on axis 
	this.expand = function (searchNode) {
		if (this.specifier instanceof AxisSpecifier) {
			return this.specifier.expand(searchNode);
		}
		else return searchNode;
	};
	
	// need to use "self" because we pass this function to traverse 
	this.matches = function (searchNode) {
		var specifier,
			test,
			predicates;
			
		specifier = (self.specifier instanceof AxisSpecifier) ? self.specifier.matches : next;

		if (typeof self.test == "string")
			// simple test, will remove later
			test = function (searchNode) { return self.test == searchNode.key; };
		else if (self.test instanceof NodeTest)
			test = self.test.matches;
		else
			test = next;

		predicates = ((self.predicates instanceof Array) && self.predicates.length > 0) ? all : next;
		
		return specifier(searchNode) && test(searchNode) && predicates(searchNode);
	};
};

Step.unparse = function (object) {
	var step = new Step(),
		predicates = [];
	step.specifier = (typeof object.specifier == "string") ? object.specifier : AxisSpecifier.unparse(object.specifier);
	step.test = (typeof object.specifier == "string") ? object.test : NodeTest.unparse(object.test);
	for (var i in object.predicates) {
		predicates.push(Predicate.unparse(object.predicates[i]));
	}
	step.predicates = predicates;
	return step;
};