import { useSelector } from 'react-redux';
import LeagueResData from 'renderer/Interfaces/LeagueResData';
import MainState from 'renderer/Interfaces/MainState';

const LeagueDataDisplay = () => {
	const leagueData: LeagueResData = useSelector(
		(state: MainState) => state.leagueData.value
	);
	if (leagueData === undefined) {
		return <div>No data!!</div>;
	}

	return (
		<div>
			<h3>Summoner Name: {leagueData.activePlayer.summonerName}</h3>
			<h4>Gold: {leagueData.activePlayer.currentGold}</h4>
			<h4>Level: {leagueData.activePlayer.level}</h4>
		</div>
	);
};

export default LeagueDataDisplay;
