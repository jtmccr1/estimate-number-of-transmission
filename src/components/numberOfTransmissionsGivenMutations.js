import React from 'react';
import * as d3 from 'd3';
import { getData, numericalIntegration, drawAxis } from '../utils/commonFunctions';
import * as jStat from 'jStat';
import * as R from 'ramda';

class NumberOfTransmissionsGivenMutations extends React.Component {
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

		const averageChangesPerYear = this.props.evolutionaryRate * this.props.genomeLength;
		const averageChangesPerDay = averageChangesPerYear / 365;
		// probability time
		const curriedGamma = R.curry(jStat.gamma.pdf);
		const waitingGamma = curriedGamma(R.__, this.props.numberOfMutations, 1 / averageChangesPerDay);

		// probability of number of transmission given time
		const curriedCdf = R.curry(jStat.gamma.cdf);
		const combinedProb = (i, params = this.props.params) => {
			const waitingCdf = curriedCdf(R.__, i * params[0], params[1]);
			const combinedPdf = x => {
				return waitingCdf(x) * waitingGamma(x);
			};
			return numericalIntegration(combinedPdf, [0, 500], 1000);
		};

		const data = getData(combinedProb, 1, 0.001, 1);

		data.push({
			q: 0,
			p: 1 - data[1].p,
			pOnly: 1 - data[1].p,
		});
		data.sort((a, b) => a.q - b.q);
		// Now fix so its the probably of exactly 1 or 2 ect.
		let moreTransmission = 0;
		for (let i = data.length - 1; i >= 1; --i) {
			// The last one is fine (to approximation) as is the first one
			data[i].pOnly = data[i].p - moreTransmission;
			moreTransmission = moreTransmission + data[i].pOnly;
		}
		data.pop(); // the last point is overestimated anyway
		// draw the plot
		const width = this.props.size[0];
		const height = this.props.size[1];
		const node = this.node;

		const svg = d3.select(node).style('font', '10px sans-serif');

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
			.domain([0, d3.max(data, d => d.pOnly)]);

		//remove current plot
		svg.selectAll('g').remove();
		// do the drawing
		svg.append('g').attr('transform', `translate(${this.props.margin.left},${this.props.margin.top})`);

		const svgGroup = svg.select('g');

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

		drawAxis(
			svgGroup,
			xScale,
			yScale,
			this.props.size,
			this.props.margin,
			'Number of transmission events',
			'Probability',
			xScale.domain().filter((d,i)=>!(i%5))
		);

		svgGroup.append("text")
			.classed("title",true)
			.text(`Transmission events for ${this.props.numberOfMutations} mutation(s)`)
	}
	render() {
		return (
			<div>

				<svg ref={node => (this.node = node)} viewBox={ `0 0 ${this.props.size[0]} ${this.props.size[1]}`} />
			</div>
		);
	}
}

export default NumberOfTransmissionsGivenMutations;
