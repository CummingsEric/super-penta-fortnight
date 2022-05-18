import ConfigFile from 'renderer/Interfaces/ConfigFile';
import EventInterface from 'renderer/Interfaces/EventInterface';
import Playlist from 'renderer/Interfaces/Playlist';

const Store = require('electron-store');

export default class ConfigService {
	store;

	constructor() {
		this.store = new Store();
	}

	loadConfig = (): ConfigFile => {
		return {
			library: this.getLibrary(),
			eventPlaylistMappings: this.getEventMapping(),
			priorities: this.getPriority(),
		};
	};

	setLibrary = (library: Playlist[]) => {
		this.store.set('library', library);
	};

	getLibrary = () => {
		return this.store.get('library');
	};

	setEventMapping = (mapping: EventInterface<Playlist>) => {
		this.store.set('eventPlaylistMapping', mapping);
	};

	getEventMapping = () => {
		return this.store.get('eventPlaylistMapping');
	};

	setPriority = (priorities: EventInterface<number>) => {
		this.store.set('priorities', priorities);
	};

	getPriority = () => {
		return this.store.get('eventPlaylistMapping');
	};

	deleteProperty = (key: string) => {
		this.store.delete(key);
	};
}
