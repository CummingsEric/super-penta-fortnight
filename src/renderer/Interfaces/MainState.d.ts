import LeagueResData from './LeagueResData';

export default interface MainState {
	spotifyAccessCode: { value: string };
	spotifyAccessToken: { value: string };
	spotifyRefreshToken: { value: string };
	leagueData: { value: LeagueResData };
}
