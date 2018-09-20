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
		// The sum of 2 gamma distributions with the same rate parameter is a gamma distribution with shape a1+a2
		function getData2(data, cdf, params, numberOfDays) {
			data.push({
				q: 0,
				p: 1 - cdf(numberOfDays, params[0], params[1]),
				pOnly: 1 - cdf(numberOfDays, params[0], params[1]),
			});
			let i = 1;
			let needSomeDensity = true;
			do {
				const el = {
					q: i,
					p: cdf(numberOfDays, i * params[0], params[1]),
				};
				data.push(el);
				i++;
				needSomeDensity = d3.max(data, d => d.p) < 0.001 ? true : false; // So we don't stop too soon
			} while (data[i - 1].p > 0.001 || needSomeDensity);

			// Now fix so its the probably of exactly 1 or 2 ect.
			let moreTransmission = 0;
			for (let i = data.length - 1; i >= 1; --i) {
				// The last one is fine (to approximation) as is the first one
				data[i].pOnly = data[i].p - moreTransmission;
				moreTransmission = moreTransmission + data[i].pOnly;
			}
		}
		// draw the plot
		const width = this.props.size[0];
		const height = this.props.size[1];
		const node = this.node;

		const svg = d3.select(node).style('font', '10px sans-serif');

		const data = [];
		getData2(data, this.props.cdf, this.props.params, this.props.numberOfDays);

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
			.attr('y', d => yScale(d.pOnly))
			.attr('height', d => height - this.props.margin.bottom - this.props.margin.top - yScale(d.pOnly));
	}
	render() {
		return (
			<div>
				<div>{`The probability number of transmission events expected in ${this.props.numberOfDays} Days`}</div>
				<svg ref={node => (this.node = node)} width={this.props.size[0]} height={this.props.size[1]} />
			</div>
		);
	}
}

export default NumberOfTransmissions;
