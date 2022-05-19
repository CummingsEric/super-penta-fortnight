import EventInterface from './EventInterface';
import Playlist from './Playlist';

export default interface ConfigFile {
	library: Playlist[];
	eventPlaylistMappings: EventInterface<string>;
	priorities: EventInterface<number>;
}
