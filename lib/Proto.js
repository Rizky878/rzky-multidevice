Array.prototype.random = function () {
	const Random = (arr) => arr[Math.floor(Math.random() * arr.length)];
	return Random(this);
};
