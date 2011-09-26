var findAllNodes = exports.traverse = function (match, object) {
	var output = [],
		traverse = [],
		separator = "\n",
		nodeCount = 0,
		Node = function (val, path, parent) {
			this.path = path || "";
			this.parent = parent;
			this.node = val;
		},
		process = function (object) {
			for (var i in object.node) {
				traverse.push(new Node(object.node[i], object.path + separator + i, object));
				nodeCount++;
			}
		};
		
	for (var i in object) {
		traverse.push(new Node(object[i], i));
		nodeCount++;
	}
	
	var careful = 100;
	while (nodeCount > 0 && careful > 0) {
		console.log("processing: ", traverse[0].path.split(separator).join("/"), traverse[0].node, nodeCount, careful);
		if (traverse[0].path.split(separator).slice(-1)[0] == match) output.push(traverse[0]);
		
		if (traverse[0].node instanceof Object) {
			process(traverse[0]);
		}
		traverse.shift();
		nodeCount--;
		careful--;
	}
	
	return output;
};

var test = exports.test = {
	thing1: 1,
	thing2: 2,
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