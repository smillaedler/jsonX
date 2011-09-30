// via: http://www.w3.org/TR/xpath/#NT-AbbreviatedAbsoluteLocationPath

start
	= xpath:xpath { return xpath; }
	
xpath
	= lp:LocationPath {
		return lp; 
	}

LocationPath 
	= relativePath:RelativeLocationPath {
		var paths = [],
			first = relativePath.shift();
	
		paths.push({
			name: "path",
			type: "relative",
			step: first
		});
	
		for (var i in relativePath) {
			var v = relativePath[i];
			paths.push({
				name: "path",
				type: v[0] == "/" ? "relative" : "absolute",
				step: v[1]
			});
		}
		return paths;
	}
	/ AbsoluteLocationPath

AbsoluteLocationPath
	= "//" absolutePath:RelativeLocationPath? {
		var paths = [],
			first = absolutePath.shift();
			
		paths.push({
			name: "path",
			type: "absolute",
			step: first
		});
			
		for (var i in absolutePath) {
			var v = absolutePath[i];
			paths.push({
				name: "path",
				type: v[0] == "/" ? "relative" : "absolute",
				step: v[1]
			});
		}
		return paths;
	}
	/ "/" relativePath:RelativeLocationPath? {
		var paths = [],
			first = relativePath.shift();
		
		paths.push({
			name: "path",
			type: "relative",
			step: first
		});
		
		for (var i in relativePath) {
			var v = relativePath[i];
			paths.push({
				name: "path",
				type: v[0] == "/" ? "relative" : "absolute",
				step: v[1]
			});
		}
		return paths;
	}

RelativeLocationPath
	= firstNode:Step restNodes:(("//" / "/") Step)* {
		restNodes.unshift(firstNode);
		return restNodes;
	}
	
Step
	= specifier:AxisSpecifier test:NodeTest predicates:(Predicate*) {
		return {
			name: "step",
			specifier: specifier,
			test: test,
			predicates: predicates 
		};
	}
	/ abbrev:AbbreviatedStep {
		return {
			name: "step",
			specifier: {
				name: "axisSpecifier",
				type: abbrev
			},
			test: null,
			predicates: []
		}
	}
	
AbbreviatedStep
	= ".." { return "parent"; }
	/ "." { return "self"; }	
	
AxisSpecifier
	= axisName:AxisName "::" {
		return {
			name: "axisSpecifier",
			type: axisName
		}
	}
	/ AbbreviatedAxisSpecifier

AbbreviatedAxisSpecifier
	= "@" {
		return {
			name: "axisSpecifier",
			type: "attribute"
		}
	}
	/ "" {
		return {
			name: "axisSpecifier",
			type: "self"
		}
	}

AxisName
	= 'ancestor' 
	/ 'ancestor-or-self' 
	/ 'attribute' 
	/ 'child' 
	/ 'descendant' 
	/ 'descendant-or-self' 
	/ 'following' 
	/ 'following-sibling' 
	/ 'namespace' 
	/ 'parent' 
	/ 'preceding' 
	/ 'preceding-sibling' 
	/ 'self'
	
NodeTest
	= nameTest:NameTest {
		return {
			name: "nodeTest",
			test: nameTest
		}
	}
	/ NodeType "(" ")"
	/ "processing-instruction" "(" Literal ")"

NodeType
	= "comment"
	/ "text"
	/ "processing-instruction"
	/ "node"
	
Predicate
	// easier for now
	= "[" path:QName op:('=' / '!=' / '<' / '<=' / '>') compare:QName "]" {
		return {
			name: "predicate",
			path: path,
			operator: op,
			expr: compare
		}
	}
	/ "[" expr:PredicateExpr "]" {
		return {
			name: "predicate",
			expr: expr
		}
	}

PredicateExpr
	= Expr
	
Expr
	= OrExpr
	
PrimaryExpr
	= VariableReference
	/ "(" Expr ")"
	/ Literal
	/ Number
	/ FunctionCall
	
FunctionCall 
	= FunctionName "(" (Argument ("," Argument)*)? ")"
	
Argument
	= Expr
	
UnionExpr
	= PathExpr ("|" PathExpr)*
	
PathExpr
	= LocationPath
	/ FilterExpr
	/ FilterExpr "/" RelativeLocationPath
	/ FilterExpr "//" RelativeLocationPath
	
FilterExpr
	= PrimaryExpr Predicate*

OrExpr
	= AndExpr ("or" AndExpr)*
	
AndExpr
	= EqualityExpr ("and" EqualityExpr)*
	
EqualityExpr
	= relation1:RelationalExpr relations:(("=" / "!=") RelationalExpr)* {
		var relations = [];
		return {
			name: "relational",
			relation: relation1
		}
	}
	
RelationalExpr
	= AdditiveExpr (("<" / ">" / "<=" / ">=") AdditiveExpr)*
	
AdditiveExpr
	= MultiplicativeExpr (("+" / "-") MultiplicativeExpr)*
	
MultiplicativeExpr
	= UnaryExpr ((MultiplyOperator / "div" / "mod") UnaryExpr)*
	
UnaryExpr
	= UnionExpr ("-" UnionExpr)*
	
ExprToken
	= '(' / ')' / '[' / ']' / '.' / '..' / '@' / ',' / '::' 
	/ NameTest 
	/ NodeType
	/ Operator
	/ FunctionName 
	/ AxisName 
	/ Literal
	/ Number 
	/ VariableReference
	
Literal
	= '"' [^"]* '"'
	/ "'" [^']* "'"
	
Number
	= Digits ("." Digits?)?
	/ "." Digits
	
Digits
	= [0-9]+
	
Operator
	= OperatorName
	/ MultiplyOperator
	/ '/' / '//' / '|' / '+' / '-' / '=' / '!=' / '<' / '<=' / '>' 

OperatorName
	= "and"
	/ "or"
	/ "mod"
	/ "div"
	
MultiplyOperator
	= "*"
	
FunctionName
	= QName NodeType
	
VariableReference
	= "$" QName
	
NameTest
	= "*"
	// NCName ":" "*"
	/ QName
	
ExprWhitespace
	= [\t\v\f \u00A0\uFEFF]
	/ [\u0020\u00A0\u1680\u180E\u2000\u2001\u2002\u2003\u2004\u2005\u2006\u2007\u2008\u2009\u200A\u202F\u205F\u3000]
	
QName 
	= Name 

NameStartChar 
	= ":" / [A-Z] / "_" / [a-z] 
	// one of these is grabbing square brackets, i'll figure it out later, burp...
	// [u00C0-u00D6] / [u00D8-u00F6] / [u00F8-u02FF] / [u0370-u037D] / [u037F-u1FFF] / [u200C-u200D] / [u2070-u218F] / [u2C00-u2FEF] / [u3001-uD7FF] / [uF900-uFDCF] / [uFDF0-uFFFD] / [u10000-uEFFFF] 
	
NameChar 
	= NameStartChar / "-" / "." / [0-9] 
	// [u00B7] / [u0300-u036F] / [u203F-u2040] 
	
Name 
	= nameStart:NameStartChar nameEnd:NameChar* {
		return nameStart + nameEnd.join("");
	}
	
FunctionName 
	= XPath1CoreFunctions 
	/ XFormsCoreFunctions 
	/ XPath1CoreFunctions 

XPath1CoreFunctions 
	= NodeSetFunctions 
	/ StringFunctions 
	/ BooleanFunctions 
	/ NumberFunctions 

NodeSetFunctions 
	= "last" 
	/ "position" 
	/ "count" 
	/ "id" 
	/ "local-name" 
	/ "namespace-uri" 
	/ "name" 

StringFunctions 
	= "string" 
	/ "concat" 
	/ "starts-with" 
	/ "contains" 
	/ "substring-before" 
	/ "substring-after" 
	/ "substring" 
	/ "string-length" 
	/ "normalize-space" 
	/ "translate" 

BooleanFunctions 
	= "boolean" 
 	/ "not" 
	/ "true" 
	/ "false" 
	/ "lang" 

NumberFunctions 
	= "number" 
	/ "sum" 
	/ "floor" 
	/ "ceiling" 
	/ "round" 

XFormsCoreFunctions 
	= XFormsFunctionsChangeContext 
	/ XFormsFunctions 

XFormsFunctionsChangeContext 
	= "instance" 

XFormsFunctions 
	= "avg" 
	/"boolean-from-string" 
	/"count-non-empty" 
	/"days-from-date" 
	/"if" 
	/"index" 
	/"max" 
	/"min" 
	/"months" 
	/"now" 
	/"property" 
	/"seconds" 
	/"seconds-from-dateTime" 