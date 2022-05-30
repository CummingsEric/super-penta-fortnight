import { CurrSong } from 'renderer/Store/currSong';
import Playlist from './Playlist';
import CurrentEvents from './CurrentEvents';
import SpotifyAuth from './SpotifyAuth';
import EventData from './EventData';
import Settings from './Settings';
import EventInterface from './EventInterface';
import ErrorMessage from './ErrorMessage';

export default interface MainState {
	eventData: { value: EventData };
	leagueData: { value: CurrentEvents };
	currSong: CurrSong;
	library: { value: Playlist[] };
	spotifyAuth: SpotifyAuth;
	eventPlaylistMappings: { value: EventInterface<string> };
	priorities: { value: EventInterface<number> };
	settings: { value: Settings };
	errorMessages: { value: ErrorMessage[] };
}
