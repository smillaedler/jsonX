var SearchNode = require("../query/searchNode");

var traverse = module.exports = function (match, object, output, absolute) {
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
	};