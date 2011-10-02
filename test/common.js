var allKeys = exports.allKeys = function (resultSet) {
	var keys = [];
	resultSet.each(function (i,e) {
		keys.push(e.key);
	});
	return keys;
}