import React from 'react';
import Sliderselector from './Sliderselector';

const Selectors = props => {
	const options = props.options.map((x, i) => (
		<option value={x} key={i}>
			{x}
		</option>
	));
	const mutationOptions = {
		min: 1,
		max: 50,
		step: 1,
		name: 'Number of mutations observed',
		label: `Number of mutations : ${props.numberOfMutations}`,
		value: props.numberOfMutations,
		updater: props.updater,
		stateKey: 'numberOfMutations',
		index: 0,
	};

	const dayOptions = {
		min: 1,
		max: 50,
		step: 1,
		name: 'Number of days between samples',
		label: `Number of days: ${props.numberOfDays}`,
		value: props.numberOfDays,
		updater: props.updater,
		stateKey: 'numberOfDays',
		index: 0,
	};

	const distributionOptions = props.distributionOptions.map((x, i) => (
		<option value={x} key={i}>
			{x}
		</option>
	));

	const distributionSlidersOptions = {
		Normal: [
			{
				min: 0.1,
				max: 50,
				step: 0.1,
				name: 'mean',
				label: `mean: ${props.numberOfDays}`,
				value: 1, //props.distributionParameters[0].value,
				updater: props.updater,
				stateKey: 1, // props.distributionParameters[0].name,
			},
			{
				min: 0.1,
				max: 10,
				step: 0.1,
				name: 'sigma',
				label: `sigma: ${props.numberOfDays}`,
				value: props.numberOfDays,
				updater: props.updater,
				stateKey: 'sigma',
			},
		],
		Gamma: [
			{
				min: 0.1,
				max: 10,
				step: 0.1,
				name: 'shape1',
				label: `shape1: ${props.distributionParameters[0]}`,
				value: props.distributionParameters[0],
				updater: props.updater,
				stateKey: 'distributionParameters',
				index: 0,
			},
			{
				min: 0.1,
				max: 10,
				step: 0.1,
				name: 'shape2',
				label: `shape2: ${props.distributionParameters[1]}`,
				value: props.distributionParameters[1],
				updater: props.updater,
				stateKey: 'distributionParameters',
				index: 1,
			},
		],
	};

	const distributionSliders = distributionSlidersOptions[props.distributionSelection].map((x, i) => (
		<Sliderselector {...x} key={i} />
	));

	const mutationDayOptions = props.selectedOption === 'Number of Mutations' ? mutationOptions : dayOptions;
	return (
		<div>
			<Sliderselector
				min={0.00001}
				max={0.005}
				step={0.00001}
				name={'Evoluonary Rate'}
				label={`Rate of Evolution: ${props.evolutionaryRate} subsitutions/site/year`}
				value={props.evolutionaryRate}
				updater={props.updater}
				stateKey={'evolutionaryRate'}
				index={0}
			/>
			<Sliderselector
				min={10000}
				max={30000}
				step={50}
				name={'Genome Length'}
				label={`Genome Length: ${props.genomeLength / 1000} Kb`}
				value={props.genomeLength}
				updater={props.updater}
				stateKey={'genomeLength'}
				index={0}
			/>
			<label>Condition on</label>
			<select value={props.selectedOption} onChange={e => props.updater('selectedOption', e)}>
				{options}
			</select>
			<Sliderselector {...mutationDayOptions} />
			<label>Transmission Distribution</label>
			<select value={props.distributionSelection} onChange={e => props.updater('distributionSelection', e)}>
				{distributionOptions}
			</select>
			<div>{distributionSliders}</div>
		</div>
	);
};
export default Selectors;
