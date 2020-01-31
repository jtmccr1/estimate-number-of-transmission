import React from 'react';
import * as d3 from 'd3';
import * as R from 'ramda';
import { getData, drawAxis } from '../utils/commonFunctions';

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

		const curriedCdf = R.curry(function(cdf, params, numberOfDays, transmissions) {
			return cdf(numberOfDays, transmissions * params[0], params[1]);
		});
		const waitingCdf = curriedCdf(this.props.cdf, this.props.params, this.props.numberOfDays);
		let data = getData(waitingCdf, 1, 0.001, 1); //.filter(d => d.q > 0); // we need to set the 0 point as 1-cdf of at least 1;
		data.push({
			q: 0,
			p: 1 - this.props.cdf(this.props.numberOfDays, this.props.params[0], this.props.params[1]),
			pOnly: 1 - this.props.cdf(this.props.numberOfDays, this.props.params[0], this.props.params[1]),
		});
		data.sort((a, b) => a.q - b.q);
		// Now we want probablity of only that many transmission events no at least this many

		let moreTransmission = 0;
		for (let i = data.length - 1; i >= 1; --i) {
			// The last one is fine (to approximation) as is the first one
			data[i].pOnly = data[i].p - moreTransmission;
			moreTransmission = moreTransmission + data[i].pOnly;
		}

		// draw the plot
		const width = this.props.size[0];
		const height = this.props.size[1];
		const node = this.node;

		const svg = d3.select(node).style('font', '10px sans-serif');
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

		//remove current plot
		svg.selectAll('g').remove();
		// do the drawing
		svg.append('g').attr('transform', `translate(${this.props.margin.left},${this.props.margin.top})`);

		const svgGroup = svg.select('g');

		drawAxis(
			svgGroup,
			xScale,
			yScale,
			this.props.size,
			this.props.margin,
			'Number of transmission events',
			'Probability'
		);

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
				<div>{`The number of transmission events expected in ${this.props.numberOfDays} days`}</div>
				<svg ref={node => (this.node = node)} width={this.props.size[0]} height={this.props.size[1]} />
			</div>
		);
	}
}

export default NumberOfTransmissions;
