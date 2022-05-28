import Playlist from './Playlist';
import EventInterface from './EventInterface';
import CurrentEvents from './CurrentEvents';
import SpotifyAuth from './SpotifyAuth';
import EventData from './EventData';
import Settings from './Settings';

export default interface MainState {
	eventData: { value: EventData };
	leagueData: { value: CurrentEvents };
	library: { value: Playlist[] };
	spotifyAuth: SpotifyAuth;
	eventPlaylistMappings: { value: EventInterface<string> };
	priorities: { value: EventInterface<number> };
	settings: { value: Settings };
}
