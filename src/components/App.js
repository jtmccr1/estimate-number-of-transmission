import React, { Component } from 'react';
import Selectors from './Selectors';
import MutationsPlot from './mutationsOverTime';
import DayPlot from './daysForMutations';
import ProbabilityOfTransmission from './probabilityOfTransmission';
import NumberOfTransmissions from './numberOfTransmissions';
import NumberOfTransmissionsGivenMutations from './numberOfTransmissionsGivenMutations';
import { pdfFunctions, cdfFunctions } from '../utils/commonFunctions';
import '../style/App.css';
import '../style/plots.css';

class App extends Component {
	constructor(props) {
		super(props);
		this.updateOnSelection = this.updateOnSelection.bind(this);
		this.state = {
			evolutionaryRate: 0.0009,
			genomeLength: 30000,
			conditionalOptions: ['Number of Mutations', 'Number of Days'],
			selectedOption: 'Number of Mutations',
			numberOfMutations: 1,
			numberOfDays: 1,
			distributionOptions: ['Gamma'], //'LogNormal'],
			distributionSelection: 'Gamma',
			distributionParameters: [1.5, 3],
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
			<div>
				<div className="container">
					<div >
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
					<div className={"plot"}>
						<ProbabilityOfTransmission
							size={[400, 500]}
							margin={{ top: 50, right: 50, bottom: 50, left: 50 }}
							params={this.state.distributionParameters}
							pdf={pdfFunctions[this.state.distributionSelection]}
							numberOfDays={this.state.numberOfDays}
							fixOn={this.state.selectedOption}
						/>
					</div>
					{this.state.selectedOption === 'Number of Mutations' ? (
						<div className={"plot"}>
							<DayPlot
								size={[400, 500]}
								margin={{ top: 50, right: 50, bottom: 50, left: 50 }}
								genomeLength={this.state.genomeLength}
								evolutionaryRate={this.state.evolutionaryRate}
								numberOfMutations={this.state.numberOfMutations}
							/>
						</div>
					) : (
						<div className={"plot"}>
							<MutationsPlot
								size={[400, 500]}
								margin={{ top: 50, right: 50, bottom: 50, left: 50 }}
								genomeLength={this.state.genomeLength}
								evolutionaryRate={this.state.evolutionaryRate}
								numberOfDays={this.state.numberOfDays}
							/>
						</div>
					)}


					{this.state.selectedOption === 'Number of Days' ? (
						<div className={"plot"}>
							<NumberOfTransmissions
								size={[400, 500]}
								margin={{ top: 50, right: 50, bottom: 50, left: 50 }}
								params={this.state.distributionParameters}
								cdf={cdfFunctions[this.state.distributionSelection]}
								numberOfDays={this.state.numberOfDays}
							/>
						</div>
					) : (
						<div className={"plot"}>
							<NumberOfTransmissionsGivenMutations
								size={[400, 500]}
									margin={{ top: 50, right: 50, bottom: 50, left: 50 }}
								params={this.state.distributionParameters}
								genomeLength={this.state.genomeLength}
								evolutionaryRate={this.state.evolutionaryRate}
								cdf={cdfFunctions[this.state.distributionSelection]}
								numberOfMutations={this.state.numberOfMutations}
							/>
						</div>
					)}
					<div />
				</div>
			</div>
		);
	}
}

export default App;
