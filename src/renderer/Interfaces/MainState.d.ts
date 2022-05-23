import { CurrSong } from 'renderer/Store/currSong';
import Playlist from './Playlist';
import CurrentEvents from './CurrentEvents';
import SpotifyAuth from './SpotifyAuth';
import EventData from './EventData';

export default interface MainState {
	eventData: { value: EventData };
	leagueData: { value: CurrentEvents };
	currSong: CurrSong;
	library: { value: Playlist[] };
	spotifyAuth: SpotifyAuth;
}
