import LeaguePlayerStats from './LeagueStats';

export default interface LeagueResData {
	activePlayer: {
		abilities: Record<string, unknown>[];
		championSats: Record<string, unknown>;
		currentGold: number;
		fullRunes: Record<string, unknown>;
		level: number;
		summonerName: string;
		teamRelativeColors: boolean;
	};
	allPlayers: LeaguePlayerStats[];
	events: {
		Events: Record<string, unknown>[];
	};
}
