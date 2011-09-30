var Path = require("./path"),
	parser = require("../parser/xpath");

var XPath = module.exports = function (string) {
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
		// console.log("paths: ", paths);
		var result;
	
		for (i in paths) {
			result = paths[i].matches(result || json);
			if (result.isEmpty) break;
		}
	
		// console.log("result: ", result);	
		return result.unwrap();			
	};

	// ---------------------------------------------
	// add a new path to this xpath
	// ---------------------------------------------

	this.addPath = function (path) {
		paths.push(path);
	};

	// ---------------------------------------------
	// matches (so this can be used in the matches chain, sometimes there are subpaths ie //node[path/to/thing=thing])
	// ---------------------------------------------

	this.matches = function (searchNode) {
	
	};

	if (typeof string == "string") {
		try {
			unparse(parser.parse(string));
		}
		catch (e) {
			console.log("ugh, error: ", e);
		}
	}
	// passed in from [path=expr]
	else if (typeof string == "array") unparse(array);
};

XPath.unparse = function (object) {
	var x = new XPath();
	for (i in object) {
		x.addPath(Path.unparse(object[i]));
	}
	return x;
};