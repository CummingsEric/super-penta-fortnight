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

export interface LeaguePlayerStats {
	championName: string;
	isBot: boolean;
	isDead: boolean;
	items: [
		{
			canUse: boolean;
			consumable: boolean;
			count: number;
			displayName: string;
			itemId: number;
			price: number;
			rawDescription: string;
			rawDisplayName: string;
			slot: number;
		}
	];
	level: number;
	position: string;
	rawChampionName: string;
	rawSkinName: string;
	respawnTimer: number;
	runes: Record<string, unknown>;
	scores: LeagueScores;
	skinID: number;
	skinName: string;
	summonerName: string;
	summonerSpells: Record<string, unknown>;
	team: string;
}

export interface LeagueScores {
	assists: number;
	creepScore: number;
	deaths: number;
	kills: number;
	wardScore: number;
}

export interface LeagueEvent {
	EventID: number;
	EventName: string;
	EventTime: number;
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	[x: string]: any;
}
