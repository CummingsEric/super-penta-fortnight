import { useSelector } from 'react-redux';
import CurrentEvents from 'renderer/Interfaces/CurrentEvents';

import MainState from 'renderer/Interfaces/MainState';

import JSONPrinter from '../global/JSONPrinter';

const LeagueDataDisplay = () => {
	const leagueDict: CurrentEvents = useSelector(
		(state: MainState) => state.leagueData.value
	);

	return (
		<div>
			<h1 className="text-center">League Data Debugger</h1>
			<div className="container pt-4">
				<div className="pb-4">
					<JSONPrinter data={leagueDict} />
				</div>
			</div>
		</div>
	);
};

export default LeagueDataDisplay;
