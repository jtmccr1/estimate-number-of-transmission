import React, { Component } from 'react';
import * as d3 from 'd3';

class mutationsPlot extends React.Component {
	constructor(props) {
		super(props);
		this.drawPlot = this.drawPlot.bind(this);
	}

	componentDidMount() {
		this.drawEpiPlot();
	}
	componentDidUpdate() {
		this.drawEpiPlot();
	}

	drawPlot() {
		//Helper functions
		let f = [];
		const factorial = function(n) {
			if (n == 0 || n == 1) return 1;
			if (f[n] > 0) return f[n];
			return (f[n] = factorial(n - 1) * n);
		};
		// from http://bl.ocks.org/mbostock/4349187 from https://github.com/rambaut/Probability-of-Difference/blob/gh-pages/index.html
		// Sample from a normal distribution with mean 0, stddev 1.
		const probabilityOfNumberOfChanges = function(mutations, days, genomeLength, ratePerSitePerYear) {
			const averageChangesPerYear = ratePerSitePerYear * genomeLength;
			const averageChangesPerDay = averageChangesPerYear / 365;
			const averageChangesInDays = averageChangesPerDay * days;
			const prob =
				(Math.exp(-averageChangesInDays) * Math.pow(averageChangesInDays, mutations)) / factorial(mutations);
			return prob;
		};

		const getData = function(data, genomeLength, ratePerSitePerYear, numberOfDays) {
			let i = 0;
			let needSomeDensity = true;
			do {
				const el = {
					q: i,
					p: probabilityOfNumberOfChanges(i, genomeLength, ratePerSitePerYear, numberOfDays),
				};
				data.push(el);
				i++;
				needSomeDensity = d3.max(data, d => d.p) < 0.001 ? true : false; // So we don't stop too soon
			} while (data[i - 1].p > 0.001 || needSomeDensity);
		};

		// draw the plot

		const node = this.node;

		const svg = d3.select(node).style('font', '10px sans-serif');

		const data = [];

		getData(data, this.props.genomeLength, this.props.evolutionaryRate, this.props.numberOfDays); // popuate data

		const xScale = d3
			.scaleBand()
			.range([this.props.margin.left, width - this.props.margin.left - this.props.margin.right])
			.padding(0.1)
			.domain(
				data.map(function(d) {
					return d.q;
				})
			);

		const yScale = d3
			.scaleLinear()
			.range([height - this.props.margin.top - this.props.margin.bottom, this.props.margin.bottom])
			.domain([0, 1]);
		const xAxis = d3
			.axisBottom()
			.scale(xScale)
			.ticks(10);
		const yAxis = d3
			.axisLeft()
			.scale(yScale)
			.ticks(5);

		const makeLinePath = d3
			.line()
			.x(d => xScale(d.q))
			.y(d => yScale(d.p))
			.curve(d3.curveStepAfter);

		svg.append('g').attr('transform', `translate(${this.props.margin.left},${this.props.margin.top})`);

		svg.append('g')
			.attr('class', 'x axis')
			.attr('transform', `translate(0,${height - this.props.margin.top - this.props.margin.bottom} )`)
			.call(xAxis);
		// Add the text label for the x axis
		svg.append('text')
			.attr(
				'transform',
				`translate(${width / 2},${height - this.props.margin.top - this.props.margin.bottom + 30})`
			)
			.style('text-anchor', 'middle')
			.text('Number of Mutations');
		svg.append('g')
			.attr('class', 'y axis')
			.attr('transform', `translate(${this.props.margin.left},0)`)
			.call(yAxis);
		// Add the text label for the Y axis
		svg.append('text')
			.attr('transform', 'rotate(-90)')
			.attr('y', this.props.margin.left - 45)
			.attr('x', 0 - height / 2)
			.attr('dy', '1em')
			.style('text-anchor', 'middle')
			.text('Probability');

		svg.selectAll('rect')
			.data(data)
			.enter()
			.append('rect')
			.attr('class', 'prob-rect')
			.attr('x', d => xScale(d.q))
			.attr('width', xScale.bandwidth())
			.attr('y', d => yScale(d.p))
			.attr('height', d => height - this.props.margin.bottom - this.props.margin.top - yScale(d.p));
	}
	render() {
		return (
			<div>
				<div {...chartTitleCSS}>{this.props.title}</div>
				<svg ref={node => (this.node = node)} width={this.props.size[0]} height={this.props.size[1]} />
			</div>
		);
	}
}

export default mutationsPlot;
