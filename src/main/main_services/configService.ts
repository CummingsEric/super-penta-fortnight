import ConfigFile from 'renderer/Interfaces/ConfigFile';
import Playlist from 'renderer/Interfaces/Playlist';
import SpotifyAuth from 'renderer/Interfaces/SpotifyAuth';
import Store from 'electron-store';
import EventData from 'renderer/Interfaces/EventData';
import Settings from 'renderer/Interfaces/Settings';
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
			settings: this.getSettings(),
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

	// Spotify Based Methods
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

	setSettings = (settings: Settings) => {
		this.config.settings = settings;
		this.store.set('settings', settings);
	};

	getSettings = (): Settings => {
		const settings = this.store.get('settings') as Settings;
		if (settings === null || settings === undefined)
			return this.defaultSettings();
		return settings;
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

	defaultSettings = (): Settings => {
		return defaultConfig.settings;
	};

	defaultEvents = () => {
		return defaultConfig.eventData;
	};
}
