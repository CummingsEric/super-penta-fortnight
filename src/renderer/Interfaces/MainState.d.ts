import LeagueResData from './LeagueResData';
import SpotifyAccessToken from './SpotifyAccessToken';
import SpotifyAccessCode from './SpotifyAccessCode';
import Playlist from './Playlist';

export default interface MainState {
	spotifyAccessCode: { value: SpotifyAccessCode };
	spotifyAccessToken: { value: SpotifyAccessToken };
	spotifyRefreshToken: { value: string };
	leagueData: { value: LeagueResData };
	libraryData: { value: Playlist[] };
}
