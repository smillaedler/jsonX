var x = require("./xpath");
	
var xpath = new x.path("//node/test/here");

xpath.exec({
	first: {
		node: {
			test: {
				here: "yay"
			}
		}
	},
	fail: {
		nothing: {
			here: {
				
			}
		}
	},
	hidden: [
		{
			node: {
				test: {
					here: "yay two!"
				}
			}
		}
	]
});