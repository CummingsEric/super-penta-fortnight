import LeagueResData from './LeagueResData';
import SpotifyAccessToken from './SpotifyAccessToken';
import SpotifyAccessCode from './SpotifyAccessCode';
import Playlist from './Playlist';
import EventInterface from './EventInterface';

export default interface MainState {
	spotifyAccessCode: { value: SpotifyAccessCode };
	spotifyAccessToken: { value: SpotifyAccessToken };
	spotifyRefreshToken: { value: string };
	leagueData: { value: LeagueResData };
	library: { value: Playlist[] };
	eventPlaylistMappings: { value: EventInterface<string> };
	priorities: { value: EventInterface<number> };
}
