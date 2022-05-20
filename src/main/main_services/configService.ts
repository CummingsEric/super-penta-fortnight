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
			wereInTheEndGameNow: '0',
			objStolenByFriendly: '0',
			objStolenByEnemy: '0',
			elderKilledByFriendly: '0',
			elderKilledByEnemy: '0',
			barronKilledByFriendly: '0',
			barronKilledByEnemy: '0',
			elderSpawningSoon: '0',
			frinedlyAce: '0',
			enemyAce: '0',
			summonerKillstreak: '0',
			summonerDeathstreak: '0',
			summonerMultikill: '0',
			enemyKillstreak: '0',
			alone: '0',
			heraldKilledByFriendly: '0',
			heraldKilledByEnemy: '0',
			summonerDoingGood: '0',
			summonerDoingBad: '0',
		};
	};

	defaultPriority = (): EventInterface<number> => {
		return {
			wereInTheEndGameNow: 0,
			objStolenByFriendly: 0,
			objStolenByEnemy: 0,
			elderKilledByFriendly: 0,
			elderKilledByEnemy: 0,
			barronKilledByFriendly: 0,
			barronKilledByEnemy: 0,
			elderSpawningSoon: 0,
			frinedlyAce: 0,
			enemyAce: 0,
			summonerKillstreak: 0,
			summonerDeathstreak: 0,
			summonerMultikill: 0,
			enemyKillstreak: 0,
			alone: 0,
			heraldKilledByFriendly: 0,
			heraldKilledByEnemy: 0,
			summonerDoingGood: 0,
			summonerDoingBad: 0,
		};
	};
}
