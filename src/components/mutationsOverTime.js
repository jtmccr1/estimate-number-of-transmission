import React from 'react';
import * as d3 from 'd3';
import * as R from 'ramda';
import * as jStat from 'jStat';
import { getData, drawAxis } from '../utils/commonFunctions';

class MutationsPlot extends React.Component {
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

		// from http://bl.ocks.org/mbostock/4349187 from https://github.com/rambaut/Probability-of-Difference/blob/gh-pages/index.html
		// Sample from a normal distribution with mean 0, stddev 1.
		const probabilityOfNumberOfChanges = R.curry(function(days, genomeLength, ratePerSitePerYear, mutations) {
			const averageChangesPerYear = ratePerSitePerYear * genomeLength;
			const averageChangesPerDay = averageChangesPerYear / 365;
			const averageChangesInDays = averageChangesPerDay * days;
			const prob = jStat.poisson.pdf(mutations, averageChangesInDays);
			return prob;
		});
		const CurriedprobabilityOfNumberOfChanges = probabilityOfNumberOfChanges(
			this.props.numberOfDays,
			this.props.genomeLength,
			this.props.evolutionaryRate
		);
		// draw the plot
		const width = this.props.size[0];
		const height = this.props.size[1];
		const node = this.node;

		const svg = d3.select(node).style('font', '10px sans-serif');

		const data = getData(CurriedprobabilityOfNumberOfChanges);

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

		//remove current plot
		svg.selectAll('g').remove();
		// do the drawing
		svg.append('g').attr('transform', `translate(${this.props.margin.left},${this.props.margin.top})`);

		const svgGroup = svg.select('g');

		drawAxis(svgGroup, xScale, yScale, this.props.size, this.props.margin, 'Number of Mutations', 'Probability');
		// Add data
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
				<div>{`The number of expected mutations in ${this.props.numberOfDays} day(s)`}</div>
				<svg ref={node => (this.node = node)} width={this.props.size[0]} height={this.props.size[1]} />
			</div>
		);
	}
}

export default MutationsPlot;
