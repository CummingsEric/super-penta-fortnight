import SpotifyAccessToken from './SpotifyAccessToken';
import SpotifyAccessCode from './SpotifyAccessCode';
import Playlist from './Playlist';
import EventInterface from './EventInterface';
import CurrentEvents from './CurrentEvents';
import SpotifyAuth from './SpotifyAuth';

export default interface MainState {
	spotifyAccessCode: { value: SpotifyAccessCode };
	spotifyAccessToken: { value: SpotifyAccessToken };
	spotifyRefreshToken: { value: string };
	leagueData: { value: CurrentEvents };
	library: { value: Playlist[] };
	spotifyAuth: SpotifyAuth;
	eventPlaylistMappings: { value: EventInterface<string> };
	priorities: { value: EventInterface<number> };
}
