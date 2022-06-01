import { CurrSong } from 'renderer/Store/currSong';
import Playlist from './Playlist';
import CurrentEvents from './CurrentEvents';
import SpotifyAuth from './SpotifyAuth';
import EventData from './EventData';
import Settings from './Settings';
import ErrorMessage from './ErrorMessage';

export default interface MainState {
	eventData: { value: EventData };
	leagueData: { value: CurrentEvents };
	currSong: CurrSong;
	library: { value: Playlist[] };
	spotifyAuth: SpotifyAuth;
	settings: { value: Settings };
	errorMessages: { value: ErrorMessage[] };
}
