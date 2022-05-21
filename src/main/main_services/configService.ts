import ConfigFile from 'renderer/Interfaces/ConfigFile';
import EventInterface from 'renderer/Interfaces/EventInterface';
import Playlist from 'renderer/Interfaces/Playlist';
import SpotifyAuth from 'renderer/Interfaces/SpotifyAuth';

import Store from 'electron-store';

export default class ConfigService {
	store;

	constructor() {
		this.store = new Store();
	}

	loadConfig = (): ConfigFile => {
		return {
			eventPlaylistMappings: this.getEventMapping(),
			priorities: this.getPriority(),
			spotifyAuth: this.getSpotifyAuth(),
			library: this.getLibrary(),
		};
	};

	setLibrary = (library: Playlist[]) => {
		this.store.set('library', library);
	};

	getLibrary = () => {
		const library = this.store.get('library');
		if (library === null || library === undefined) return [];
		return library;
	};

	setEventMapping = (mapping: EventInterface<string>) => {
		this.store.set('eventPlaylistMapping', mapping);
	};

	getEventMapping = () => {
		const mapping = this.store.get('eventPlaylistMapping');
		if (
			mapping === null ||
			mapping === undefined ||
			mapping instanceof Array
		)
			return this.defaultMapping();
		return mapping;
	};

	setPriority = (priorities: EventInterface<number>) => {
		this.store.set('priorities', priorities);
	};

	getPriority = () => {
		const priority = this.store.get('priorities');
		if (priority === null || priority === undefined)
			return this.defaultPriority();
		return priority;
	};

	resetConfig = () => {
		this.deleteProperty('library');
		this.deleteProperty('eventPlaylistMapping');
		this.deleteProperty('priorities');
	};

	setSpotifyAuth = (spotifyAuth: SpotifyAuth) => {
		this.store.set('spotifyAuth', spotifyAuth);
	};

	getSpotifyAuth = (): SpotifyAuth => {
		const spotifyAuth = this.store.get('spotifyAuth');
		if (spotifyAuth === null || spotifyAuth === undefined)
			return this.defaultAuth();
		return spotifyAuth;
	};

	deleteProperty = (key: string) => {
		this.store.delete(key);
	};

	defaultAuth = (): SpotifyAuth => {
		return {
			spotifyAccessCode: undefined,
			spotifyAccessToken: undefined,
			spotifyRefreshToken: undefined,
		};
	};

	defaultMapping = (): EventInterface<string> => {
		return {
			wereInTheEndGameNow: '',
			objStolenByFriendly: '',
			objStolenByEnemy: '',
			elderKilledByFriendly: '',
			elderKilledByEnemy: '',
			barronKilledByFriendly: '',
			barronKilledByEnemy: '',
			elderSpawningSoon: '',
			frinedlyAce: '',
			enemyAce: '',
			summonerKillstreak: '',
			summonerDeathstreak: '',
			summonerMultikill: '',
			enemyKillstreak: '',
			alone: '',
			heraldKilledByFriendly: '',
			heraldKilledByEnemy: '',
			summonerDoingGood: '',
			summonerDoingBad: '',
		};
	};

	defaultPriority = (): EventInterface<number> => {
		return {
			wereInTheEndGameNow: 20,
			objStolenByFriendly: 16,
			objStolenByEnemy: 16,
			elderKilledByFriendly: 12,
			elderKilledByEnemy: 12,
			barronKilledByFriendly: 11,
			barronKilledByEnemy: 11,
			elderSpawningSoon: 10,
			frinedlyAce: 14,
			enemyAce: 14,
			summonerKillstreak: 5,
			summonerDeathstreak: 5,
			summonerMultikill: 6,
			enemyKillstreak: 6,
			alone: 9,
			heraldKilledByFriendly: 4,
			heraldKilledByEnemy: 4,
			summonerDoingGood: 1,
			summonerDoingBad: 1,
		};
	};
}
