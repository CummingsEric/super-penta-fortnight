import LeagueResData from './LeagueResData';
import SpotifyAccessToken from './SpotifyAccessToken';
import SpotifyAccessCode from './SpotifyAccessCode';

export default interface MainState {
	spotifyAccessCode: { value: SpotifyAccessCode };
	spotifyAccessToken: { value: SpotifyAccessToken };
	spotifyRefreshToken: { value: string };
	leagueData: { value: LeagueResData };
}
