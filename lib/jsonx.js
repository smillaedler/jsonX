var XPath = require('./xpath/xpath');

// ====================================================
// public
// ====================================================

// a Doc is a wrapper for an object that can have xpaths applied against it
	
var Doc = exports.Doc = function (object) {
		this.document = object;
		this.xpath = function (string) {
			var xpath = new XPath(string);
			return xpath.exec(this.document);
		};
	};

