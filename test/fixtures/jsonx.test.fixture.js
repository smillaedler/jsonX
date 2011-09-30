SimpleSearch = {
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
};

SimpleNodeTest = {
	first: {
		node: {
			match: "match"
		}
	},
	second: {
		node: {
			match: "fail"
		}
	},
	third: {
		node: "match"
	}
}