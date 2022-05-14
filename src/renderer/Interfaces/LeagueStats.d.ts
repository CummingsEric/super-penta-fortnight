import LeagueScores from './LeagueScores';

export default interface LeaguePlayerStats {
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
