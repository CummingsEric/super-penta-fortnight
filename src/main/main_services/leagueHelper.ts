/* eslint-disable @typescript-eslint/no-unused-vars */
import LeagueResData, {
	LeagueEvent,
	LeaguePlayerStats,
} from 'renderer/Interfaces/LeagueResData';
import CurrentEvents from 'renderer/Interfaces/CurrentEvents';
import EventData, { EventProps } from 'renderer/Interfaces/EventData';

const processData = (
	leagueData: LeagueResData,
	lastUpdate: number
): CurrentEvents | null => {
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

	// get the number of friendly champs in the game
	const getNumFriendlyChamp = (): number => {
		if (!Array.isArray(allPlayers)) return 0;
		return allPlayers.filter((p) => p.team === summonerTeam).length;
	};
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
		const killsAssists =
			summonerStats.scores.assists + summonerStats.scores.kills;
		// If no deaths or kills KDA of 1
		if (summonerStats.scores.deaths === 0 && killsAssists === 0) return 1;
		return killsAssists / Math.max(1, summonerStats.scores.deaths);
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
		if (
			isPlayerDead(summonerName) === true ||
			getNumFriendlyChamp() === 1
		) {
			return false;
		}
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
		if (
			isPlayerDead(summonerName) === true ||
			getNumFriendlyChamp() === 1
		) {
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

	const summonerRecentMultikill = (): boolean => {
		const multikill = recentEvents.find(
			(e) => e.EventName === 'Multikill' && e.KillerName === summonerName
		);
		return multikill !== undefined;
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

	const elderSpawningSoon = (): boolean => {
		const dragonKills = events.filter((e) => e.EventName === 'DragonKill');
		const friendlyNames = getFriendlySummonerNames();
		const enemyNames = getEnemySummonerNames();
		const friendlyDragKills = dragonKills.filter((e) =>
			friendlyNames.includes(e.KillerName)
		);
		const enemyDragKills = dragonKills.filter((e) =>
			enemyNames.includes(e.KillerName)
		);
		if (friendlyDragKills.length >= 4 || enemyDragKills.length >= 4) {
			const lastDragon = dragonKills.reduce((a, b) => {
				if (a.EventTime > b.EventTime) return a;
				return b;
			});
			const lastDragonKilledTime = lastDragon.EventTime;
			const diff = gameTime - lastDragonKilledTime;
			if (diff > 5 * 60 && diff < 6 * 60) return true;
		}
		return false;
	};

	const leagueEventDict: CurrentEvents = {
		lastUpdate,
		updateTime: gameTime,
		wereInTheEndGameNow: nexusExposed(),
		objStolenByFriendly: objectiveStolenByFriendly(),
		objStolenByEnemy: objectiveStolenByEnemy(),
		elderKilledByFriendly: elderKilledByFriendly(),
		elderKilledByEnemy: elderKilledByEnemy(),
		barronKilledByFriendly: baronKilledByFriendly(),
		barronKilledByEnemy: baronKilledByEnemy(),
		elderSpawningSoon: elderSpawningSoon(),
		friendlyAce: friendlyAce(),
		enemyAce: enemyAce(),
		summonerMultikill: summonerRecentMultikill(),
		summonerKillstreak: false,
		summonerDeathstreak: false,
		enemyKillstreak: false,
		alone: isAloneInBot() || isAloneInGame(),
		heraldKilledByFriendly: heraldKilledByFriendly(),
		heraldKilledByEnemy: heraldKilledByEnemy(),
		summonerDoingGood: getSummonerKDA() >= 2,
		summonerDoingBad: getSummonerKDA() <= 0.75,
		defaultEvent: true,
	};

	return leagueEventDict;
};

const findMaxEvent = (
	eventDict: CurrentEvents,
	priorities: EventData
): EventProps | undefined => {
	const sortedPrios = Object.entries(priorities).sort(
		([, a]: [string, EventProps], [, b]: [string, EventProps]) => {
			if (a.priority < b.priority) return 1;
			if (a.priority > b.priority) return -1;
			return 0;
		}
	);
	const event = sortedPrios.find(
		([key]) => eventDict[key as keyof CurrentEvents] === true
	);
	if (event === undefined) return undefined;
	return event[1];
};

export default processData;

export { findMaxEvent };
