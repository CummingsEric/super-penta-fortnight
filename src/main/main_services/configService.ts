import ConfigFile from 'renderer/Interfaces/ConfigFile';
import Playlist from 'renderer/Interfaces/Playlist';
import SpotifyAuth from 'renderer/Interfaces/SpotifyAuth';

import Store from 'electron-store';
import EventData from 'renderer/Interfaces/EventData';
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
			eventData: this.getEventData(),
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
			return [];
		}
		return library;
	};

	setEventData = (eventData: EventData) => {
		this.config.eventData = eventData;
		this.store.set('eventData', eventData);
	};

	getEventData = (): EventData => {
		const eventData = this.store.get('eventData') as EventData;
		if (eventData === null || eventData === undefined)
			return this.defaultEvents();
		return eventData;
	};

	setSpotifyAuth = (spotifyAuth: SpotifyAuth) => {
		this.config.spotifyAuth = spotifyAuth;
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
		this.setEventData(this.defaultEvents());
		this.setLibrary(this.defaultLibrary());
	};

	defaultLibrary = (): Playlist[] => {
		return defaultConfig.library;
	};

	defaultAuth = (): SpotifyAuth => {
		return defaultConfig.spotifyAuth;
	};

	defaultEvents = () => {
		return defaultConfig.eventData;
	};
}
