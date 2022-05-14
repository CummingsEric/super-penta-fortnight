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
	allPlayers: [
		{
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
			scores: {
				assists: number;
				creepScore: number;
				deaths: number;
				kills: number;
				wardScore: number;
			};
			skinID: number;
			skinName: string;
			summonerName: string;
			summonerSpells: Record<string, unknown>;
			team: string;
		}
	];
	events: {
		Events: Record<string, unknown>[];
	};
}
