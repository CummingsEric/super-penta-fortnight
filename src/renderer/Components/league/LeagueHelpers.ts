import LeagueResData from 'renderer/Interfaces/LeagueResData';
import LeagueScores from 'renderer/Interfaces/LeagueScores';
import LeaguePlayerStats from 'renderer/Interfaces/LeagueStats';

const processData = (leagueData: LeagueResData) => {
	const { allPlayers } = leagueData;
	const gameInfo = {};
	const { activePlayer } = leagueData;
	const { summonerName } = leagueData.activePlayer;
	const summonerData = allPlayers.find(
		(p) => p.summonerName === summonerName
	);
	const summonerTeam = summonerData === undefined ? '' : summonerData.team;

	events = leagueData.events;
	gameData = {};
	recentTime = null;

	const getFriendlyStats = (): LeaguePlayerStats[] => {
		if (!Array.isArray(allPlayers)) return [];
		return allPlayers.filter((p) => p.team === summonerTeam);
	};

	const getEnemyStats = (): LeaguePlayerStats[] => {
		if (!Array.isArray(allPlayers)) return [];
		return allPlayers.filter((p) => p.team !== summonerTeam);
	};

	const getFriendlySummonerNames = (): string[] => {
		return getFriendlyStats().map((p) => p.summonerName);
	};

	const getEnemySummonerNames = (): string[] => {
		return getEnemyStats().map((p) => p.summonerName);
	};

	const getPlayerStats = (playerName: string): LeaguePlayerStats => {
		const playerStats = allPlayers.find(
			(p) => p.summonerName === playerName
		);
		// TODO: Fix this
		if (playerStats === undefined) throw new Error('Err');
		return playerStats;
	};

	const getPlayerKDA = (playerName: string): number => {
		const summonerStats = getPlayerStats(playerName);
		return (
			(summonerStats.scores.assists + summonerStats.scores.kills) /
			Math.max(1, summonerStats.scores.deaths)
		);
	};

	const getSummonerKDA = (): number => {
		return getPlayerKDA(summonerName);
	};

	const getFriendlyTeamKDA = (): number[] => {
		return getFriendlyStats().map(
			(s) =>
				(s.scores.assists + s.scores.kills) /
				Math.max(1, s.scores.deaths)
		);
	};

	const getEnemyTeamKDA = (): number[] => {
		return getEnemyStats().map(
			(s) =>
				(s.scores.assists + s.scores.kills) /
				Math.max(1, s.scores.deaths)
		);
	};

	const getPlayerGold = (playerName: string): number => {
		const playerStats = getPlayerStats(playerName);
		const summonerItems = playerStats.items;
		const goldArr = summonerItems.map(
			// eslint-disable-next-line @typescript-eslint/no-explicit-any
			(item: any) => item.price * item.count
		);
		return goldArr.reduce((sum: number, a: number) => sum + a, 0);
	};

	const getSummonerGold = (): number => {
		return getPlayerGold(summonerName);
	};

	const getFriendlyTeamGold = (): number => {
		const goldArr = getFriendlySummonerNames().map((n) => getPlayerGold(n));
		return goldArr.reduce((sum, a) => sum + a, 0);
	};

	const getEnemyTeamGold = (): number => {
		const goldArr = getEnemySummonerNames().map((n) => getPlayerGold(n));
		return goldArr.reduce((sum, a) => sum + a, 0);
	};

	const getFriendlyPlayerByPosition = (position: string): string => {
		const teamStats = getFriendlyStats();
		return teamStats.find((p) => p.position === position);
	};

	const getEnemyPlayerByPosition = (position: string): string => {
		const enemyStats = getEnemyStats();
		return enemyStats.find((p) => p.position === position);
	};

	const getPlayerPosition = (playerName: string): string => {
		const playerStats = getPlayerStats(playerName);
		return playerStats.position;
	};

	const isPlayerDead = (playerName: string): boolean => {
		const playerStats = getPlayerStats(playerName);
		return playerStats.isDead;
	};

	const isFriendlyPositionDead = (position: string): boolean => {
		const positionStats = getFriendlyPlayerByPosition(position);
		return positionStats.isDead;
	};

	const isEnemyPositionDead = (position: string): boolean => {
		const positionStats = getEnemyPlayerByPosition(position);
		return positionStats.isDead;
	};

	const isAloneInBot = () => {
		const summonerPosition = getPlayerPosition(summonerName);
		if (summonerPosition === 'BOTTOM') {
			return isFriendlyPositionDead('SUPPORT');
		}
		if (summonerPosition === 'SUPPORT') {
			return isFriendlyPositionDead('BOTTOM');
		}
		return false;
	};

	const isAloneInGame = () => {
		// Can't be alone if youre dead
		if (isPlayerDead(summonerName) === true) {
			return false;
		}
		const teamStats = getFriendlyStats();
		for (stat in teamStats) {
			// If anyone else on your team is alive you're not alone
			if (stat.summonerName !== summonerName && stat.isDead === 0) {
				return false;
			}
		}
		return true;
	};
};

export default processData();
