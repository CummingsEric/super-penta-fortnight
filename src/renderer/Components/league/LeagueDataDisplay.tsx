import { useSelector } from 'react-redux';
import LeagueEventDictionary from 'renderer/Interfaces/LeagueEvents';
import LeagueResData from 'renderer/Interfaces/LeagueResData';
import MainState from 'renderer/Interfaces/MainState';
import processData from './LeagueHelpers';

const LeagueDataDisplay = () => {
	const leagueData: LeagueResData = useSelector(
		(state: MainState) => state.leagueData.value
	);

	console.log(processData(leagueData, 1444));

	const leagueEventDict = processData(leagueData, 1444);

	if (leagueData === undefined || leagueEventDict === null) {
		return <div>No data!!</div>;
	}

	const eventDebugger = Object.keys(leagueEventDict).map((key: string) => (
		<li key={key}>
			{key} :{' '}
			{String(leagueEventDict[key as keyof LeagueEventDictionary])}
		</li>
	));

	return (
		<div>
			<h3>Summoner Name: {leagueData.activePlayer.summonerName}</h3>
			<h4>Gold: {leagueData.activePlayer.currentGold}</h4>
			<h4>Level: {leagueData.activePlayer.level}</h4>
			<ul>
				<li>Last update: 1444</li>
				{eventDebugger}
			</ul>
		</div>
	);
};

export default LeagueDataDisplay;
