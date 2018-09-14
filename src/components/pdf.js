function normalPdf(mean, sigma, x) {
	const exponent = Math.pow(x - mean, 2) / (2 * Math.pow(sigma, 2));
	const sqrt = 2 * Math.PI * Math.pow(sigma, 2);
	return Math.pow(Math.sqrt(sqrt), -1) * Math.exp(-exponent);
}

function gammaPdf(shape1, shape2, x) {
	let f = [];
	const factorial = function(n) {
		if (n === 0 || n === 1) return 1;
		if (f[n] > 0) return f[n];
		return (f[n] = factorial(n - 1) * n);
	};
	const numerator = Math.pow(shape2, shape1) * Math.pow(x, shape1 - 1) * Math.exp(-shape2 * x);
	const demominator = factorial(shape1 - 1);
	return numerator / demominator;
}

const pdfFunctions = {
	Normal: normalPdf,
	Gamma: gammaPdf,
};

export default pdfFunctions;
