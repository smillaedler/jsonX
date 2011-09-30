var SearchNode = module.exports = function (val, path, parent) {
	var self = this;
	this.path = path || "";
	this.parent = parent;
	this.node = val;
	this.__defineGetter__("key", function () {
		return self.path.split(SearchNode.separator).slice(-1)[0]
	});
};

SearchNode.separator = "\n";