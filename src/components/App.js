import React, { Component } from 'react';
import logo from '../logo.svg';
import Selectors from './Selectors';
import '../style/App.css';

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
		};
	}
	updateOnSelection(key, event) {
		let newState = {};
		newState[key] = event.target.value;
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
					/>
				</div>

				<div>
					<mutationsPlot
						size={[500, 500]}
						margins={{ top: 50, right: 50, bottom: 10, left: 50 }}
						genomeLength={this.state.genomeLength}
						evolutionaryRate={this.state.evolutionaryRate}
						numberOfDays={this.state.numberOfDays}
					/>
				</div>

				<div>
					<p>{'Plot2'}</p>
				</div>
			</div>
		);
	}
}

export default App;
