import React from 'react';
import * as d3 from 'd3';
import * as R from 'ramda';
import * as jStat from 'jStat';

class DayPlot extends React.Component {
	constructor(props) {
		super(props);
		this.drawPlot = this.drawPlot.bind(this);
	}

	componentDidMount() {
		this.drawPlot();
	}
	componentDidUpdate() {
		this.drawPlot();
	}

	drawPlot() {
		//Helper functions
		let f = [];
		const factorial = function(n) {
			if (n === 0 || n === 1) return 1;
			if (f[n] > 0) return f[n];
			return (f[n] = factorial(n - 1) * n);
		};
		function getData2(data, pdf) {
			let i = 0;
			let needSomeDensity = true;
			do {
				const el = {
					q: i,
					p: pdf(i),
				};
				data.push(el);
				// This freezes when the numbers get big. We can take bigger steps in these cases.
				i++;
				needSomeDensity = d3.max(data, d => d.p) < 0.001 ? true : false; // So we don't stop too soon
			} while (data[i - 1].p > 0.001 || needSomeDensity);
		}
		const curriedGamma = R.curry(jStat.gamma.pdf);
		const averageChangesPerYear = this.props.evolutionaryRate * this.props.genomeLength;
		const averageChangesPerDay = averageChangesPerYear / 365;
		// draw the plot
		const width = this.props.size[0];
		const height = this.props.size[1];
		const node = this.node;

		const svg = d3.select(node).style('font', '10px sans-serif');

		const data = [];
		const waitingGamma = curriedGamma(R.__, this.props.numberOfMutations, 1 / averageChangesPerDay);
		getData2(data, waitingGamma);
		// popuate data
		// line chart based on http://bl.ocks.org/mbostock/3883245
		const xScale = d3
			.scaleLinear()
			.range([this.props.margin.left, width - this.props.margin.left - this.props.margin.right])
			.domain([0, d3.max(data.filter(d => d.p > 0.001), d => d.q)]);

		const yScale = d3
			.scaleLinear()
			.range([height - this.props.margin.top - this.props.margin.bottom, this.props.margin.bottom])
			.domain([0, d3.max(data, d => d.p)]);
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
			.y(d => yScale(d.p));

		//remove current plot
		svg.selectAll('g').remove();
		// do the drawing
		svg.append('g').attr('transform', `translate(${this.props.margin.left},${this.props.margin.top})`);

		const svgGroup = svg.select('g');

		svgGroup
			.append('g')
			.attr('class', 'x axis')
			.attr('transform', `translate(0,${height - this.props.margin.top - this.props.margin.bottom} )`)
			.call(xAxis);
		// Add the text label for the x axis
		svgGroup
			.append('text')
			.attr(
				'transform',
				`translate(${width / 2},${height - this.props.margin.top - this.props.margin.bottom + 30})`
			)
			.style('text-anchor', 'middle')
			.text('Number of days between sampling');

		svgGroup
			.append('g')
			.attr('class', 'y axis')
			.attr('transform', `translate(${this.props.margin.left},0)`)
			.call(yAxis);
		// Add the text label for the Y axis
		svgGroup
			.append('text')
			.attr('transform', 'rotate(-90)')
			.attr('y', this.props.margin.left - 60)
			.attr('x', 0 - height / 2)
			.attr('dy', '1em')
			.style('text-anchor', 'middle')
			.text('Probability density');

		svgGroup
			.append('path')
			.datum(data)
			.attr('class', 'line')
			.attr('d', makeLinePath);
	}
	render() {
		return (
			<div>
				<div>{`The distribution of days given ${this.props.numberOfMutations} mutation(s)`}</div>
				<svg ref={node => (this.node = node)} width={this.props.size[0]} height={this.props.size[1]} />
			</div>
		);
	}
}

export default DayPlot;
