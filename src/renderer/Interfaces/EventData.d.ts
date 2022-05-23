export interface EventProps {
	friendlyName: string;
	priority: number;
	playlistId?: string;
}

export default interface EventData {
	wereInTheEndGameNow: EventProps;
	objStolenByFriendly: EventProps;
	objStolenByEnemy: EventProps;
	elderKilledByFriendly: EventProps;
	elderKilledByEnemy: EventProps;
	barronKilledByFriendly: EventProps;
	barronKilledByEnemy: EventProps;
	elderSpawningSoon: EventProps;
	friendlyAce: EventProps;
	enemyAce: EventProps;
	summonerKillstreak: EventProps;
	summonerDeathstreak: EventProps;
	summonerMultikill: EventProps;
	enemyKillstreak: EventProps;
	alone: EventProps;
	heraldKilledByFriendly: EventProps;
	heraldKilledByEnemy: EventProps;
	summonerDoingGood: EventProps;
	summonerDoingBad: EventProps;
}
