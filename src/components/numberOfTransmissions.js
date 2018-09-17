import React from 'react';
import * as d3 from 'd3';
import * as R from 'ramda';
import { numericalIntegration } from './pdf';

class NumberOfTransmissions extends React.Component {
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
		function getData2(data, cdf, numberOfDays) {
			const cdf2 = (maxX, x) => cdf(maxX - x) * cdf(x); // * (1 - cdf(x));
			const cdf2Curried = R.curry(cdf2);
			data.push({
				q: 0,
				p: 1 - cdf(numberOfDays),
			});
			data.push({
				q: 1,
				p: cdf(numberOfDays), //* (1 - numericalIntegration(cdf2Curried(numberOfDays), [0, numberOfDays], 10000)),
			});
			data.push({
				q: 2,
				p: numericalIntegration(cdf2Curried(numberOfDays), [0, numberOfDays], 100000),
			});
		}
		const curriedCdf = R.curry(this.props.cdf);
		// draw the plot
		const width = this.props.size[0];
		const height = this.props.size[1];
		const node = this.node;

		const svg = d3.select(node).style('font', '10px sans-serif');

		const data = [];
		getData2(data, curriedCdf(R.__, ...this.props.params), this.props.numberOfDays);
		console.log(d3.sum(data, d => d.p));
		console.log(data);
		// popuate data
		// line chart based on http://bl.ocks.org/mbostock/3883245
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
			.domain([0, 1]); // d3.max(data, d => d.p)]);
		const xAxis = d3
			.axisBottom()
			.scale(xScale)
			.ticks(10);
		const yAxis = d3
			.axisLeft()
			.scale(yScale)
			.ticks(5);

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
			.text('Number transmission events');

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
			.text('Probability');

		svgGroup
			.selectAll('rect')
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
				<div>{`The probability number of transmission events observed`}</div>
				<svg ref={node => (this.node = node)} width={this.props.size[0]} height={this.props.size[1]} />
			</div>
		);
	}
}

export default NumberOfTransmissions;
