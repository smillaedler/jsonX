var NodeTest = module.exports = function () {
	var self = this;
	
	this.test;

	this.matches = function (searchNode) {
		console.log("testing node: ", self.test, searchNode);
		if (self.test == "*") return true;
		else return self.test == searchNode.key;
	};
};

NodeTest.unparse = function (object) {
	var node = new NodeTest();
	node.test = object.test;
	return node;
};