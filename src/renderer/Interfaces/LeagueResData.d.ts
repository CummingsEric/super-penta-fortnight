import LeaguePlayerStats from './LeagueStats';

export interface LeagueEvent {
	EventID: number;
	EventName: string;
	EventTime: number;
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	[x: string]: any;
}

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
		Events: LeagueEvent[];
	};
	gameData: {
		gameMode: string;
		gameTime: number;
		mapName: string;
		mapNumber: number;
		mapTerrain: string;
	};
}
