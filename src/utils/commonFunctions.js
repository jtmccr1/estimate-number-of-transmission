import * as jStat from 'jStat';
import * as d3 from 'd3';

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

// from http://bl.ocks.org/mbostock/4349187 from https://github.com/rambaut/Probability-of-Difference/blob/gh-pages/index.html
// Sample from a normal distribution with mean 0, stddev 1.
export const getData = (curriedF, xStep = 1, minP = 0.001, initial = 0) => {
	let data = [];
	let i = initial;
	let needSomeDensity = true;
	do {
		const el = {
			q: i,
			p: curriedF(i),
		};
		data.push(el);
		i = i + xStep;
		needSomeDensity = d3.max(data, d => d.p) < minP ? true : false; // So we don't stop too soon
	} while (data[data.length - 1].p > minP || needSomeDensity);
	return data;
};

export const drawAxis = (svgGroup, xScale, yScale, size, margins, xlab, ylab,tickvalues=null) => {
	//Make axis
	let xAxis,yAxis
	if(tickvalues!==null){ // hacky hack hack
	 xAxis = d3
		.axisBottom()
		.scale(xScale)
		.ticks(5)
		 .tickValues(tickvalues);
	 yAxis = d3
		.axisLeft()
		.scale(yScale)
		.ticks(5);
	}
	else{
		xAxis = d3
			.axisBottom()
			.scale(xScale)
			.ticks(5);
		yAxis = d3
			.axisLeft()
			.scale(yScale)
			.ticks(5);
	}
	// draw Axis
	svgGroup
		.append('g')
		.attr('class', 'x axis')
		.attr('transform', `translate(0,${size[1] - margins.top - margins.bottom} )`)
		.call(xAxis);
	// Add the text label for the x axis
	svgGroup
		.append('text')
		.attr('transform', `translate(${size[0] / 2},${size[1] - margins.top - margins.bottom + 30})`)
		.style('text-anchor', 'middle')
		.text(xlab);
	svgGroup
		.append('g')
		.attr('class', 'y axis')
		.attr('transform', `translate(${margins.left},0)`)
		.call(yAxis);
	// Add the text label for the Y axis
	svgGroup
		.append('text')
		.attr('transform', 'rotate(-90)')
		.attr('y', margins.left - 45)
		.attr('x', 0 - size[1] / 2)
		.attr('dy', '1em')
		.style('text-anchor', 'middle')
		.text(ylab);
};
