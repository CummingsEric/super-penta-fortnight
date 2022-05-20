import { useSelector } from 'react-redux';

import LeagueResData from 'renderer/Interfaces/LeagueResData';
import MainState from 'renderer/Interfaces/MainState';

import JSONPrinter from '../global/JSONPrinter';
import processData from './LeagueHelpers';

const LeagueDataDisplay = () => {
	const leagueData: LeagueResData = useSelector(
		(state: MainState) => state.leagueData.value
	);

	// TODO: Fix continual rerenders
	console.log(processData(leagueData, 1444));

	const leagueEventDict = processData(leagueData, 1444);

	if (leagueData === undefined || leagueEventDict === null) {
		return (
			<div>
				<h1 className="text-center">League Data Debugger</h1>
				<span>No data yet</span>
			</div>
		);
	}

	return (
		<div>
			<h1 className="text-center">League Data Debugger</h1>
			<div className="container pt-4">
				<div className="pb-4">
					<JSONPrinter data={leagueEventDict} />
				</div>
				<JSONPrinter data={leagueData} />
			</div>
		</div>
	);
};

export default LeagueDataDisplay;
