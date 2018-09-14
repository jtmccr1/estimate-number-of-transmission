import React, { Component } from 'react';
import Selectors from './Selectors';
import MutationsPlot from './mutationsOverTime';
import DayPlot from './daysForMutations';
import ProbabilityOfTransmission from './probabilityOfTransmission';
import pdfFunctions from './pdf';
import '../style/App.css';
import '../style/plots.css';

class App extends Component {
	constructor(props) {
		super(props);
		this.updateOnSelection = this.updateOnSelection.bind(this);

		this.state = {
			evolutionaryRate: 0.001,
			genomeLength: 13000,
			conditionalOptions: ['Number of Mutations', 'Number of Days'],
			selectedOption: 'Number of Mutations',
			numberOfMutations: 1,
			numberOfDays: 1,
			distributionOptions: ['Normal', 'Gamma'],
			distributionSelection: 'Normal',
			distributionParameters: [],
		};
	}
	updateOnSelection(key, event) {
		let newState = {};
		newState[key] = event.target.value;
		this.setState(newState);
	}
	normalPdf(mean, sigma, x) {
		const exponent = Math.pow(x - mean, 2) / (2 * Math.pow(sigma, 2));
		const sqrt = 2 * Math.PI * Math.pow(sigma, 2);
		return Math.pow(Math.sqrt(sqrt), -1) * Math.exp(-exponent);
	}
	render() {
		console.log(this.normalPdf(1, 1, 1));
		return (
			<div className="container">
				<div>
					<Selectors
						evolutionaryRate={this.state.evolutionaryRate}
						updater={this.updateOnSelection}
						genomeLength={this.state.genomeLength}
						options={this.state.conditionalOptions}
						selectedOption={this.state.selectedOption}
						numberOfDays={this.state.numberOfDays}
						numberOfMutations={this.state.numberOfMutations}
						distributionOptions={this.state.distributionOptions}
						distributionSelection={this.state.distributionSelection}
					/>
				</div>

				{this.state.selectedOption === 'Number of Mutations' ? (
					<div>
						<DayPlot
							size={[700, 500]}
							margin={{ top: 50, right: 50, bottom: 50, left: 50 }}
							genomeLength={this.state.genomeLength}
							evolutionaryRate={this.state.evolutionaryRate}
							numberOfMutations={this.state.numberOfMutations}
						/>
					</div>
				) : (
					<div>
						<MutationsPlot
							size={[700, 500]}
							margin={{ top: 50, right: 50, bottom: 50, left: 50 }}
							genomeLength={this.state.genomeLength}
							evolutionaryRate={this.state.evolutionaryRate}
							numberOfDays={this.state.numberOfDays}
						/>
					</div>
				)}
				<div>
					<ProbabilityOfTransmission
						size={[700, 500]}
						margin={{ top: 50, right: 50, bottom: 50, left: 50 }}
						params={[1, 1]}
						pdf={this.normalPdf}
					/>
				</div>
			</div>
		);
	}
}

export default App;
