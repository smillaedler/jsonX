var parser = require("./xpathLang");

// ====================================================
// notes
// ====================================================



var SearchNode = (function () {
		var searchNode = function (val, path, parent) {
				var self = this;
				this.path = path || "";
				this.parent = parent;
				this.node = val;
				this.__defineGetter__("key", function () {
					return self.path.split(SearchNode.separator).slice(-1)[0]
				});
			};
		searchNode.separator = "\n";
		return searchNode;
	})(),
	traverse = function (match, object, output, absolute) {
		var absolute = (typeof absolute == "undefined") ? true : absolute,
			output = output || [],
			traverse = [],
			separator = SearchNode.separator,
			root = (object instanceof SearchNode) ? object : new SearchNode(object),
			process = function (object) {			
				if (object.node instanceof Object || object.node instanceof Array)
					for (var i in object.node)
						traverse.push(new SearchNode(object.node[i], object.path + separator + i, object));
			};

		process(root);	
		while (traverse.length > 0) {
			// console.log("processing: ", traverse[0].path.split(separator).join("/"), traverse[0].node, nodeCount, careful);
			if (match(traverse[0])) output.push(traverse[0]);
			if (absolute) process(traverse[0]);

			traverse.shift();
		}

		return output;
	},
	ResultSet = (function () {
		var resultSet = function () {
			
			var self = this;
			
			// ---------------------------------------------
			// isEmpty :: Bool
			// ---------------------------------------------

			this.__defineGetter__("isEmpty", function () {
				return self.length == 0;
			});
			
			// ---------------------------------------------
			// each :: (Index -> a -> b) -> Void
			// ---------------------------------------------

			this.each = function (callback) {
				for (i in self) {
					if (i.match(/^\d+$/)) {
						callback(i, self[i]);
					}
				}
			};
			
			// ---------------------------------------------
			// iterate through object and convert Node -> Object
			// ---------------------------------------------

			this.unwrap = function () {
				return this;
			};
		};
		resultSet.prototype = Array.prototype;
		return resultSet;
	})(),
	Path = function () {
		var self = this,
			matchFunction = function () {
				return function (searchNode) {
					return self.step && (self.step.test == searchNode.key);
				};
			};
		
		this.type = "relative";
		this.step;
		
		// ---------------------------------------------
		// match takes a js object or a resultset of searchnodes and returns a resultset of matches
		// ---------------------------------------------

		this.match = function (object) {
			var matchObject = function (object) {
				if (self.type == "absolute")
					return traverse(matchFunction(), object, new ResultSet());
				else if (self.type == "relative")
					return traverse(matchFunction(), object, new ResultSet(), false);					
			};
			
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
	},
	Step = function () {
		this.specifier;
		this.test;
		this.predicates;
	},
	Predicate = function () {
		this.path;
		this.operator;
		this.expr;
	};

// ---------------------------------------------
// class methods
// ---------------------------------------------

Path.unparse = function (object) {
	var path = new Path();
	path.type = object.type;
	path.step = Step.unparse(object.step);
	return path;
};

Step.unparse = function (object) {
	var step = new Step(),
		predicates = [];
	step.specifier = object.specifier;
	step.test = object.test;
	for (var i in object.predicates) {
		predicates.push(Predicate.unparse(object.predicates[i]));
	}
	step.predicates = predicates;
	return step;
};

Predicate.unparse = function (object) {
	var predicate = new Predicate();
	predicate.path = object.path;
	predicate.operator = object.operator;
	predicate.expr = object.expr;
	return predicate;
};

// ====================================================
// public
// ====================================================
	
var xpath = exports.path = function (string) {
	// ---------------------------------------------
	// private
	// ---------------------------------------------

	var self = this,
		unparse = function (array) {
			for (var i in array) {
				self.addPath(Path.unparse(array[i]));
			}
		},
		paths = [];
	
	// ---------------------------------------------
	// public
	// ---------------------------------------------
	
	// ---------------------------------------------
	// take a json object and execute the path on it
	// ---------------------------------------------

	this.exec = function (json) {
		console.log("paths: ", paths);
		var result;
		
		for (i in paths) {
			result = paths[i].match(result || json);
			if (result.isEmpty) break;
		}
		
		console.log("result: ", result);	
		return result.unwrap();			
	};
	
	// ---------------------------------------------
	// add a new path to this xpath
	// ---------------------------------------------

	this.addPath = function (path) {
		paths.push(path);
	};
	
	if (string) {
		try {
			unparse(parser.parse(string));
		}
		catch (e) {
			console.log("ugh, error: ", e);
		}
	}
};