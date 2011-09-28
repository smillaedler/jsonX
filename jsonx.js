var Node = function (val, path, parent) {
		this.path = path || "";
		this.parent = parent;
		this.node = val;
	},
	ResultSet = function () {
		this.set = [];
	};

var traverse = exports.traverse = function (match, object) {
	var output = [],
		traverse = [],
		separator = "\n",
		root = new Node(object),
		process = function (object) {			
			if (object.node instanceof Object || object.node instanceof Array)
				for (var i in object.node)
					traverse.push(new Node(object.node[i], object.path + separator + i, object));
		};
	
	process(root);	
	while (traverse.length > 0) {
		// console.log("processing: ", traverse[0].path.split(separator).join("/"), traverse[0].node, nodeCount, careful);
		if (traverse[0].path.split(separator).slice(-1)[0] == match) output.push(traverse[0]);
		process(traverse[0]);
		
		traverse.shift();
	}
	
	return output;
};

var test = exports.test = {
	thing1: 1,
	thing2: [
		{ thingnothing: 4 },
		{ objectt: {
			match: {
				thing2: 1,
				thingthing: {}
			}
		}}
	],
	thing3: {
		nomatch1: 2,
		nomatch2: {
			nomatch3: {
				match: 4
			}
		}
	},
	match: {
		thing1: 22,
		thing2: 33
	}
};