import React, { Component } from 'react';
import Selectors from './Selectors';
import MutationsPlot from './mutationsOverTime';
import DayPlot from './daysForMutations';
import ProbabilityOfTransmission from './probabilityOfTransmission';
import { pdfFunctions } from './pdf';
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
			distributionOptions: ['Gamma', 'LogNormal'],
			distributionSelection: 'Gamma',
			distributionParameters: [0.1, 2],
		};
	}
	updateOnSelection(key, index, event, numeric = true) {
		let newState = {};
		const newValue = numeric ? parseFloat(event.target.value) : event.target.value;
		if (Array.isArray(this.state[key])) {
			newState[key] = this.state[key].slice();
			newState[key][index] = newValue;
		} else {
			newState[key] = newValue;
		}

		this.setState(newState);
	}
	render() {
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
						distributionParameters={this.state.distributionParameters}
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
						params={this.state.distributionParameters}
						pdf={pdfFunctions[this.state.distributionSelection]}
					/>
				</div>
			</div>
		);
	}
}

export default App;
