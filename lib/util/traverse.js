var SearchNode = require("../query/searchNode"),
	ResultSet = require("../query/resultSet");

// ---------------------------------------------
// traverse :: (SearchNode -> Bool) -> SearchNode|Object -> List
//			:: (SearchNode -> Bool) -> SearchNode|Object -> ResultSet -> Boolean -> ResultSet
// ---------------------------------------------

var traverse = module.exports = function (match, object, output, absolute) {
		var absolute = (typeof absolute == "undefined") ? true : absolute,
			output = output || [],
			traverse = [],
			separator = SearchNode.separator,
			root, // = (object instanceof SearchNode) ? object : new SearchNode(object),
			process = function (object) {			
				if (object.node instanceof Object || object.node instanceof Array || object.node instanceof SearchNode)
					for (var i in object.node)
						traverse.push(new SearchNode(object.node[i], object.path + separator + i, object));
			};

		if (object instanceof SearchNode) {
			root = object;
			traverse.push(root);
		}
		else if (object instanceof ResultSet) {
			object.each(function (i,e) {
				traverse.push(e);
			});
		}
		else root = SearchNode(object);

		// console.log("root key:", root.key);
		// process(root);	
		while (traverse.length > 0) {
			console.log("processing: ", traverse[0].key);
			if (match(traverse[0])) output.push(traverse[0]);
			if (absolute) process(traverse[0]);

			traverse.shift();
		}

		return output;
	};