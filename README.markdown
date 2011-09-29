# what is jsonX?

jsonX is a port of XPath for JSON. the idea is to have a nice way to easily pull out information from the result of 
an API call, without having to worry about the source format. if an API responds with XML, it's very common to use 
XPath. if an API responds with JSON, there are various options. i would like the entire process to be merged into one 
idea.

# what is the usage like?

right now, i'm aiming towards something like:

	jsonx = require("jsonx");
	doc = new jsonx.doc({
		some: {
			xpath: {
				statement: {
					coolness: "very"
				}
			}
		}
	});
	doc.xpath("//some/xpath/statement[@coolness=very]");
	
	// returns {statement: {coolness: "very"}}
	
i still haven't decided what to do about the big difference between XML and JSON, mainly attributes/vs no attributes.
feel free to chat with me about it.	


# current status?

jsonX is still in super alpha. it only handles a few pieces of the XPath language so far, but i am chipping away at it as
fast as i can. once i have something that is actually worth using/playing with, i will bump and reflect that here.

## how can you help?

i'm focusing mostly on the aspect of object traversal (the part that is :: XPath a -> JSON b -> JSON c). i could use some
help from an XPath veteran with the parser and making sure that i cover the entire spec. also i could use some help implementing
some of the lesser used functions of XPath (some of the built in functions and axis keywords). lastly i could use some
help with my loneliness :'(.