import React, { Component } from 'react';
import Sliderselector from './Sliderselector';

const Selectors = props => {
	const options = props.options.map((x, i) => (
		<option value={x} key={i}>
			{x}
		</option>
	));
	const mutationOptions = {
		min: 1,
		max: 100,
		step: 1,
		name: 'Number of mutations observed',
		label: `Number of mutations : ${props.numberOfMutations}`,
		value: props.numberOfMutations,
		updater: props.updater,
		stateKey: 'numberOfMutations',
	};

	const dayOptions = {
		min: 1,
		max: 100,
		step: 1,
		name: 'Number of days between samples',
		label: `Number of days: ${props.numberOfDays}`,
		value: props.numberOfDays,
		updater: props.updater,
		stateKey: 'numberOfDays',
	};
	const mutationDayOptions = props.selectedOption === 'Number of Mutations' ? mutationOptions : dayOptions;
	return (
		<div>
			<Sliderselector
				min={0.00001}
				max={0.01}
				step={0.00001}
				name={'Evoluonary Rate'}
				label={`Rate of Evolution: ${props.evolutionaryRate} subsitutions/site/year`}
				value={props.evolutionaryRate}
				updater={props.updater}
				stateKey={'evolutionaryRate'}
			/>
			<Sliderselector
				min={10000}
				max={30000}
				step={50}
				name={'Genome Length'}
				label={`Genome Lenght: ${props.genomeLength / 1000} Kb`}
				value={props.genomeLength}
				updater={props.updater}
				stateKey={'genomeLength'}
			/>
			<label>Condition on</label>
			<select value={props.selectedOption} onChange={e => props.updater('selectedOption', e)}>
				{options}
			</select>
			<Sliderselector {...mutationDayOptions} />
		</div>
	);
};
export default Selectors;
