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
	},
	third: [
		{thing: "s1"},
		{matchThing2: "s2"},
		{thing: "s3"},
		{thing: "s4"}
	]
}

VerticalTest = {
	first: {
		thing: {
			here: "t1"
		}
	},
	second: {
		thang: {
			there: "t2"
		}
	},
	third: [
		{thing: {
			here: "t3"
		}}
	]
}