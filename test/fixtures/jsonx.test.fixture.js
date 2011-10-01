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

SiblingTest = {
	first: [
		{matchThing: "m1"},
		{thing: "m2"},
		{thing: "m3"}
	],
	second: {
		thing1: "t1",
		thing2: "t2",
		thing3: "t3"
	}
}