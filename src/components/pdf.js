import { gamma } from 'mathjs';
import * as d3 from 'd3';
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
	const demominator = gamma(shape1);
	return numerator / demominator;
}

export const pdfFunctions = {
	Normal: normalPdf,
	Gamma: gammaPdf,
};

export const trapeziumIntegration = (f, range) => {
	let i = 1000;

	let newArea = (f(range[1]) - f(range[0])) / (range[1] - range[0]);
	let oldArea = newArea;
	let keepGoing = true;
	do {
		const deltaX = (range[1] - range[0]) / i;
		const ys = d3.range(range[0], range[1], 1 / i).map(x => f(x));
		newArea = (deltaX / 2) * (ys.shift() + ys.pop() + d3.sum(ys.map(y => 2 * y)));
		keepGoing = Math.abs(newArea - oldArea) < 0.0001 ? false : true;
		oldArea = newArea;
		i = i * 5;
	} while (keepGoing);
	return newArea;
};

// export default pdfFunctions, trapeziumIntegration;
