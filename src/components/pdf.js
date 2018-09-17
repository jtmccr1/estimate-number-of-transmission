import * as jStat from 'jStat';

export const pdfFunctions = {
	LogNormal: jStat.lognormal.pdf,
	Gamma: jStat.gamma.pdf,
};
export const cdfFunctions = {
	LogNormal: jStat.lognormal.cdf,
	Gamma: jStat.gamma.cdf,
};

//http://montessorimuddle.org/2013/04/20/programming-numerical-integration-with-python/
export const numericalIntegration = (f, range, steps) => {
	const dx = Math.abs(range[0] - range[1]) / steps;
	let area = 0;
	for (let i = 0; i <= steps; i++) {
		const x0 = range[0] + i * dx;
		const x1 = range[0] + i * dx;
		const newArea = (dx * (f(x0) + f(x1))) / 2;
		area = area + newArea;
	}
	return area;
};
// export default pdfFunctions, trapeziumIntegration;
