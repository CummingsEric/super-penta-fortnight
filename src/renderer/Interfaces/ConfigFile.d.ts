import EventInterface from './EventInterface';
import Playlist from './Playlist';
import SpotifyAuth from './SpotifyAuth';

export default interface ConfigFile {
	library: Playlist[];
	eventPlaylistMappings: EventInterface<string>;
	priorities: EventInterface<number>;
	spotifyAuth: SpotifyAuth;
}
