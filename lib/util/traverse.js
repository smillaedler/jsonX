var SearchNode = require("../query/searchNode"),
	ResultSet = require("../query/resultSet");

// ---------------------------------------------
// traverse :: (SearchNode -> Bool) -> SearchNode -> List
//			:: (SearchNode -> Bool) -> SearchNode -> ResultSet -> Boolean -> ResultSet
//
// traverse takes a node, checks if it matches, then traverses down the tree and continues to check matches
// ---------------------------------------------

var traverse = module.exports = function (match, object, output, absolute) {
		var absolute = (typeof absolute == "undefined") ? true : absolute,
			output = output || [],
			traverse = [],
			separator = SearchNode.separator,
			root,
			process = function (object) {			
				if (object.node instanceof Object || object.node instanceof Array)
					for (var i in object.node)
						traverse.push(new SearchNode(object.node[i], object.path + separator + i, object));
				else if (object.node instanceof SearchNode)
					throw new Error("found search node");
			};

		if (object instanceof SearchNode) {
			root = object;
			traverse.push(root);
		}
		// else if (object instanceof ResultSet) {
		// 	object.each(function (i,e) {
		// 		traverse.push(e);
		// 	});
		// }
		// else root = SearchNode(object);

		while (traverse.length > 0) {
			// console.log("processing: ", traverse[0].key);
			if (match(traverse[0])) output.push(traverse[0]);
			if (absolute) process(traverse[0]);

			traverse.shift();
		}

		return output;
	};