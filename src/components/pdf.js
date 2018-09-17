import * as jStat from 'jStat';

export const pdfFunctions = {
	LogNormal: jStat.lognormal.pdf,
	Gamma: jStat.gamma.pdf,
};
export const cdfFunctions = {
	LogNormal: jStat.lognormal.cdf,
	Gamma: jStat.gamma.cdf,
};

// export default pdfFunctions, trapeziumIntegration;
