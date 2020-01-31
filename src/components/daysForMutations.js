import React from 'react';
import * as d3 from 'd3';
import * as R from 'ramda';
import * as jStat from 'jStat';
import { drawAxis, getData } from '../utils/commonFunctions';

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

		const curriedGamma = R.curry(jStat.gamma.pdf);
		const averageChangesPerYear = this.props.evolutionaryRate * this.props.genomeLength;
		const averageChangesPerDay = averageChangesPerYear / 365;

		const waitingGamma = curriedGamma(R.__, this.props.numberOfMutations, 1 / averageChangesPerDay);

		// adjusting the step makes the page respond more quickly but the line gets chunky
		const data = getData(waitingGamma, 1.5);
		// popuate data
		// draw the plot

		const width = this.props.size[0];
		const height = this.props.size[1];
		const node = this.node;
		const svg = d3.select(node).style('font', '10px sans-serif');
		// line chart based on http://bl.ocks.org/mbostock/3883245
		const xScale = d3
			.scaleLinear()
			.range([this.props.margin.left, width - this.props.margin.left - this.props.margin.right])
			.domain([0, d3.max(data.filter(d => d.p > 0.001), d => d.q)]);

		const yScale = d3
			.scaleLinear()
			.range([height - this.props.margin.top - this.props.margin.bottom, this.props.margin.bottom])
			.domain([0, d3.max(data, d => d.p)]);

		const makeLinePath = d3
			.line()
			.x(d => xScale(d.q))
			.y(d => yScale(d.p));

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
			'Number of days between sampling',
			'Probability density'
		);
		// add data
		svgGroup
			.append('path')
			.datum(data)
			.attr('class', 'line')
			.attr('d', makeLinePath);

		svgGroup.append("text")
			.classed("title",true)
			.text(`Days to ${this.props.numberOfMutations} mutation(s)`)
	}
	render() {
		return (
			<div>
				<svg ref={node => (this.node = node)} viewBox={ `0 0 ${this.props.size[0]} ${this.props.size[1]}`} />
			</div>
		);
	}
}

export default DayPlot;
