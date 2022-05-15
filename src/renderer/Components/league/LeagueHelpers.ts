import LeagueResData, { LeagueEvent } from 'renderer/Interfaces/LeagueResData';
import LeaguePlayerStats from 'renderer/Interfaces/LeagueStats';
import LeagueEventDictionary from 'renderer/Interfaces/LeagueEvents';

const processData = (
	leagueData: LeagueResData,
	lastUpdate: number
): LeagueEventDictionary | null => {
	if (leagueData === undefined) return null;

	const { allPlayers, activePlayer, gameData } = leagueData;
	const events = leagueData.events.Events;
	const { summonerName } = activePlayer;
	const { gameTime } = gameData;
	const recentEvents = events.filter((e) => e.EventTime > lastUpdate);
	const summonerData = allPlayers.find(
		(p) => p.summonerName === summonerName
	);
	const summonerTeam = summonerData === undefined ? '' : summonerData.team;

	// Get stats

	const getFriendlyStats = (): LeaguePlayerStats[] => {
		if (!Array.isArray(allPlayers)) return [];
		return allPlayers.filter((p) => p.team === summonerTeam);
	};

	const getEnemyStats = (): LeaguePlayerStats[] => {
		if (!Array.isArray(allPlayers)) return [];
		return allPlayers.filter((p) => p.team !== summonerTeam);
	};

	const getPlayerStats = (playerName: string): LeaguePlayerStats => {
		const playerStats = allPlayers.find(
			(p) => p.summonerName === playerName
		);
		// TODO: Replace errors
		if (playerStats === undefined) throw new Error('Err');
		return playerStats;
	};

	// Get Names

	const getFriendlySummonerNames = (): string[] => {
		return getFriendlyStats().map((p) => p.summonerName);
	};

	const getEnemySummonerNames = (): string[] => {
		return getEnemyStats().map((p) => p.summonerName);
	};

	// Get KDA

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

	// Get Gold

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

	// Get by position

	const getFriendlyPlayerByPosition = (
		position: string
	): LeaguePlayerStats => {
		const teamStats = getFriendlyStats();
		const playerStats = teamStats.find((p) => p.position === position);
		if (playerStats === undefined) throw new Error('Err');
		return playerStats;
	};

	const getEnemyPlayerByPosition = (position: string): LeaguePlayerStats => {
		const enemyStats = getEnemyStats();
		const playerStats = enemyStats.find((p) => p.position === position);
		if (playerStats === undefined) throw new Error('Err');
		return playerStats;
	};

	const getPlayerPosition = (playerName: string): string => {
		const playerStats = getPlayerStats(playerName);
		return playerStats.position;
	};

	// Is alive

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

	// Is alone

	const isAloneInBot = (): boolean => {
		const summonerPosition = getPlayerPosition(summonerName);
		if (summonerPosition === 'BOTTOM') {
			return isFriendlyPositionDead('SUPPORT');
		}
		if (summonerPosition === 'SUPPORT') {
			return isFriendlyPositionDead('BOTTOM');
		}
		return false;
	};

	const isAloneInGame = (): boolean => {
		// Can't be alone if youre dead
		if (isPlayerDead(summonerName) === true) {
			return false;
		}
		const teamStats = getFriendlyStats();
		for (let i = 0; i < teamStats.length; i += 1) {
			const stat = teamStats[i];
			if (stat.summonerName !== summonerName && stat.isDead === false) {
				return false;
			}
		}
		return true;
	};

	// Events

	// Aced

	const friendlyAce = (): boolean => {
		const aceEvent = recentEvents.find((e) => e.EventName === 'Ace');
		if (aceEvent === undefined) return false;
		return aceEvent.AcingTeam === summonerTeam;
	};

	const enemyAce = (): boolean => {
		const aceEvent = recentEvents.find((e) => e.EventName === 'Ace');
		if (aceEvent === undefined) return false;
		return aceEvent.AcingTeam !== summonerTeam;
	};

	// Game ending

	const nexusExposed = (): boolean => {
		const turretsKilled = recentEvents.filter(
			(e) => e.EventName === 'TurretKilled'
		);
		// Check all the turrets killed to see if any are nexus turrets
		const nexusTurretKilled = turretsKilled.find((e) => {
			const turretId = e.TurretKilled.slice(10, 14);
			// C means mid lane, 01 and 02 are the nexus turrets
			return turretId === 'C_01' || turretId === 'C_02';
		});
		return nexusTurretKilled !== undefined;
	};

	// Objectives

	const dragKill = (): LeagueEvent | null => {
		const drag = recentEvents.find((e) => e.EventName === 'DragonKill');
		if (drag === undefined) return null;
		return drag;
	};

	const friendlyDragKill = (): LeagueEvent | null => {
		const dragon = dragKill();
		if (dragon === null) return null;
		const names = getFriendlySummonerNames();
		if (names.includes(dragon.KillerName)) {
			return dragon;
		}
		return null;
	};

	const enemyDragKill = (): LeagueEvent | null => {
		const dragon = dragKill();
		if (dragon === null) return null;
		const names = getEnemySummonerNames();
		if (names.includes(dragon.KillerName)) {
			return dragon;
		}
		return null;
	};

	const elderKilledByFriendly = (): boolean => {
		const drag = friendlyDragKill();
		if (drag === null) return false;
		return drag.DragonType === 'Elder';
	};

	const elderKilledByEnemy = (): boolean => {
		const drag = enemyDragKill();
		if (drag === null) return false;
		return drag.DragonType === 'Elder';
	};

	const baronKilledByFriendly = (): boolean => {
		const baron = recentEvents.find((e) => e.EventName === 'BaronKill');
		if (baron === undefined) return false;
		const names = getFriendlySummonerNames();
		return names.includes(baron.KillerName);
	};

	const heraldKilledByFriendly = (): boolean => {
		const herald = recentEvents.find((e) => e.EventName === 'HeraldKill');
		if (herald === undefined) return false;
		const names = getFriendlySummonerNames();
		return names.includes(herald.KillerName);
	};

	const heraldKilledByEnemy = (): boolean => {
		const herald = recentEvents.find((e) => e.EventName === 'HeraldKill');
		if (herald === undefined) return false;
		const names = getEnemySummonerNames();
		return names.includes(herald.KillerName);
	};

	const baronKilledByEnemy = (): boolean => {
		const baron = recentEvents.find((e) => e.EventName === 'BaronKill');
		if (baron === undefined) return false;
		const names = getEnemySummonerNames();
		return names.includes(baron.KillerName);
	};

	const objectiveStolenByFriendly = (): boolean => {
		const objKill = recentEvents.filter((e) =>
			['DragonKill', 'HeraldKill', 'BaronKill'].includes(e.EventName)
		);
		const stolenObj = objKill.filter((e) => e.Stolen === true);
		const names = getFriendlySummonerNames();
		const steal = stolenObj.find((e) => names.includes(e.KillerName));
		return steal !== undefined;
	};

	const objectiveStolenByEnemy = (): boolean => {
		const objKill = recentEvents.filter((e) =>
			['DragonKill', 'HeraldKill', 'BaronKill'].includes(e.EventName)
		);
		const stolenObj = objKill.filter((e) => e.Stolen === true);
		const names = getEnemySummonerNames();
		const steal = stolenObj.find((e) => names.includes(e.KillerName));
		return steal !== undefined;
	};

	const leagueEventDict: LeagueEventDictionary = {
		lastUpdate,
		updateTime: gameTime,
		wereInTheEndGameNow: nexusExposed(),
		objStolenByFriendly: objectiveStolenByFriendly(),
		objStolenByEnemy: objectiveStolenByEnemy(),
		elderKilledByFriendly: elderKilledByFriendly(),
		elderKilledByEnemy: elderKilledByEnemy(),
		barronKilledByFriendly: baronKilledByFriendly(),
		barronKilledByEnemy: baronKilledByEnemy(),
		elderSpawningSoon: false,
		frinedlyAce: friendlyAce(),
		enemyAce: enemyAce(),
		summonerKillstreak: false,
		summonerDeathstreak: false,
		summonerMultikill: false,
		enemyKillstreak: false,
		alone: isAloneInBot() || isAloneInGame(),
		heraldKilledByFriendly: heraldKilledByFriendly(),
		heraldKilledByEnemy: heraldKilledByEnemy(),
		summonerDoingGood: getSummonerKDA() >= 2,
		summonerDoingBad: getSummonerKDA() <= 0.5,
	};

	return leagueEventDict;
};

export default processData;
