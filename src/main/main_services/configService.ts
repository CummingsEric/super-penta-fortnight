import ConfigFile from 'renderer/Interfaces/ConfigFile';
import EventInterface from 'renderer/Interfaces/EventInterface';
import Playlist from 'renderer/Interfaces/Playlist';
import SpotifyAuth from 'renderer/Interfaces/SpotifyAuth';

import Store from 'electron-store';
import defaultConfig from './defaultConfig.json';

export default class ConfigService {
	store;

	config: ConfigFile;

	constructor() {
		this.store = new Store();
		this.config = this.loadConfig();
	}

	getConfig = (): ConfigFile => {
		return this.config;
	};

	loadConfig = (): ConfigFile => {
		return {
			eventPlaylistMappings: this.getEventMapping(),
			priorities: this.getPriority(),
			spotifyAuth: this.getSpotifyAuth(),
			library: this.getLibrary(),
		};
	};

	setLibrary = (library: Playlist[]) => {
		this.config.library = library;
		this.store.set('library', library);
	};

	getLibrary = (): Playlist[] => {
		const library = this.store.get('library') as Playlist[];
		if (library === null || library === undefined) {
			this.setLibrary([]);
			return [];
		}
		return library;
	};

	setEventMapping = (mapping: EventInterface<string>) => {
		this.config.eventPlaylistMappings = mapping;
		this.store.set('eventPlaylistMapping', mapping);
	};

	getEventMapping = (): EventInterface<string> => {
		const mapping = this.store.get(
			'eventPlaylistMapping'
		) as EventInterface<string>;
		if (
			mapping === null ||
			mapping === undefined ||
			mapping instanceof Array
		)
			return this.defaultMapping();
		return mapping;
	};

	setPriority = (priorities: EventInterface<number>) => {
		this.config.priorities = priorities;
		this.store.set('priorities', priorities);
	};

	getPriority = (): EventInterface<number> => {
		const priority = this.store.get('priorities') as EventInterface<number>;
		if (priority === null || priority === undefined)
			return this.defaultPriority();
		return priority;
	};

	setSpotifyAuth = (spotifyAuth: SpotifyAuth) => {
		this.store.set('spotifyAuth', spotifyAuth);
	};

	getSpotifyAuth = (): SpotifyAuth => {
		const spotifyAuth = this.store.get('spotifyAuth') as SpotifyAuth;
		if (spotifyAuth === null || spotifyAuth === undefined)
			return this.defaultAuth();
		return spotifyAuth;
	};

	deleteProperty = (key: string) => {
		this.store.delete(key);
	};

	resetConfig = () => {
		this.config = defaultConfig;
		this.setEventMapping(this.defaultMapping());
		this.setPriority(this.defaultPriority());
		this.setLibrary(this.defaultLibrary());
	};

	defaultLibrary = (): Playlist[] => {
		return defaultConfig.library;
	};

	defaultAuth = (): SpotifyAuth => {
		return defaultConfig.spotifyAuth;
	};

	defaultMapping = (): EventInterface<string> => {
		return defaultConfig.eventPlaylistMappings;
	};

	defaultPriority = (): EventInterface<number> => {
		return defaultConfig.priorities;
	};
}
