// ---------------------------------------------
// ResultSet :: List SearchNode
// ---------------------------------------------

var ResultSet = module.exports = function () {
	
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

ResultSet.prototype = Array.prototype;